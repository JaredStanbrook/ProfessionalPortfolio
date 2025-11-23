import { Hono } from "hono";
import { eq } from "drizzle-orm";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import {
  dbMiddleware,
  authMiddleware,
  type CustomContext,
  csrfMiddleware,
  getCsrfToken,
} from "../db";
import { user } from "../db/schema/user";
import { authenticator } from "../db/schema/authenticator";

const rpName = "My App";
const rpID = "localhost"; // CHANGE THIS IN PRODUCTION (e.g., "myapp.com")
const origin = `http://${rpID}:5173`; // CHANGE THIS IN PRODUCTION

export const authRoute = new Hono<{ Bindings: Env; Variables: CustomContext }>()
  .use("*", dbMiddleware)
  .use("*", authMiddleware)
  .get("/csrf-token", (c) => {
    return c.json({ token: getCsrfToken(c) });
  })
  /*.use("*", csrfMiddleware)*/
  /**
   * 1. REGISTRATION: Get Options
   */
  .post("/register/options", async (c) => {
    const { email } = await c.req.json<{ email: string }>();
    if (!email) return c.json({ error: "Email required" }, 400);

    const db = c.get("db");

    // Check if user exists, or prepare a new ID
    const existingUser = await db.select().from(user).where(eq(user.email, email)).get();
    const userID = existingUser ? existingUser.id : crypto.randomUUID();

    // Get existing authenticators
    const userAuthenticators = existingUser
      ? await db.select().from(authenticator).where(eq(authenticator.userId, existingUser.id)).all()
      : [];

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: isoUint8Array.fromUTF8String(userID),
      userName: email,
      attestationType: "none",
      excludeCredentials: userAuthenticators.map((auth) => ({
        id: auth.credentialId,
        transports: auth.transports ? JSON.parse(auth.transports) : undefined,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    c.get("setChallenge")(options.challenge);

    return c.json(options);
  })

  /**
   * 2. REGISTRATION: Verify
   */
  .post("/register/verify", async (c) => {
    try {
      const { email, response } = await c.req.json();
      const challenge = c.get("getChallenge")();

      if (!challenge) return c.json({ error: "Challenge expired" }, 400);

      const verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });

      if (verification.verified && verification.registrationInfo) {
        // FIX: Destructure the new 'credential' object
        const { credential } = verification.registrationInfo;
        const { id, publicKey, counter, transports } = credential;

        const db = c.get("db");

        // 1. Upsert User (Create if new)
        let userId = "";
        const existingUser = await db.select().from(user).where(eq(user.email, email)).get();

        if (!existingUser) {
          userId = crypto.randomUUID();
          await db.insert(user).values({ id: userId, email });
        } else {
          userId = existingUser.id;
        }

        // 2. Save Authenticator
        await db.insert(authenticator).values({
          id: crypto.randomUUID(),
          userId: userId,
          credentialId: id,
          credentialPublicKey: isoBase64URL.fromBuffer(publicKey),
          counter: counter,
          transports: JSON.stringify(transports || []),
        });

        // 3. Log them in
        await c.get("setSession")(userId);

        return c.json({ verified: true });
      }

      return c.json({ verified: false }, 400);
    } catch (error: any) {
      // 🚨 THIS LOG WILL REVEAL THE ISSUE
      console.error("VERIFICATION FAILED:", error);
      return c.json({ error: error.message }, 500);
    }
  })
  /**
   * 3. LOGIN: Get Options
   */
  .post("/login/options", async (c) => {
    const { email } = await c.req.json<{ email: string }>();

    const db = c.get("db");
    const foundUser = await db.select().from(user).where(eq(user.email, email)).get();

    if (!foundUser) return c.json({ error: "User not found" }, 404);

    // Get user's authenticators
    const userAuths = await db
      .select()
      .from(authenticator)
      .where(eq(authenticator.userId, foundUser.id))
      .all();

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userAuths.map((auth) => ({
        id: auth.credentialId,
        transports: auth.transports ? JSON.parse(auth.transports) : undefined,
      })),
      userVerification: "preferred",
    });

    // Save challenge
    c.get("setChallenge")(options.challenge);

    return c.json(options);
  })
  /**
   * 4. LOGIN: Verify
   */
  .post("/login/verify", async (c) => {
    const { email, response } = await c.req.json();
    const challenge = c.get("getChallenge")();

    if (!challenge) return c.json({ error: "Challenge expired" }, 400);

    const db = c.get("db");
    const foundUser = await db.select().from(user).where(eq(user.email, email)).get();

    if (!foundUser) return c.json({ error: "User not found" }, 400);

    // Fetch the specific authenticator used
    const auth = await db
      .select()
      .from(authenticator)
      .where(eq(authenticator.credentialId, response.id))
      .get();

    if (!auth) return c.json({ error: "Authenticator not found" }, 400);

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: auth.credentialId,
        publicKey: isoBase64URL.toBuffer(auth.credentialPublicKey),
        counter: auth.counter,
        transports: auth.transports ? JSON.parse(auth.transports) : undefined,
      },
    });

    if (verification.verified) {
      const { authenticationInfo } = verification;

      // Update counter to prevent replay attacks
      await db
        .update(authenticator)
        .set({ counter: authenticationInfo.newCounter })
        .where(eq(authenticator.id, auth.id));

      // Create Session
      await c.get("setSession")(foundUser.id);

      return c.json({ verified: true });
    }

    return c.json({ verified: false }, 400);
  })
  /**
   * 5. GET Current User / Session Check (/me)
   */
  .get("/me", (c) => {
    // The authMiddleware (running globally) checks the session cookie
    // and populates c.get("user") if valid.
    const user = c.get("user");
    if (!user) {
      // If no session is found, return 401 Unauthorized
      // The frontend should interpret this as "logged out"
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Return the user object (safe to expose, usually just ID and Email)
    return c.json(user);
  })
  /**
   * 6. LOGOUT (Destroy Session)
   */
  .post("/logout", (c) => {
    const destroySession = c.get("destroySession");

    // The middleware provides this helper function
    destroySession();

    // Return a simple success message
    return c.json({ success: true });
  });
