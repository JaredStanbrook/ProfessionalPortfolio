import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import { dbMiddleware, authMiddleware, type CustomContext, getCsrfToken } from "../db";
import { user } from "../db/schema/user";
import { authenticator } from "../db/schema/authenticator";

// --- Zod Schemas ---

// 1. Shared Email Schema (Keep this strict)
const emailSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

/**
 * LOOSE SCHEMAS
 * We only validate that 'response' has the absolute minimum fields
 * required for us to pass it to simplewebauthn without crashing.
 */

// 2. Registration
const registerVerifySchema = z.object({
  email: z.string().email(),
  challengeId: z.string().min(1, "Challenge ID is missing"),
  // Allow 'response' to be almost anything, as long as it has an ID
  response: z
    .object({
      id: z.string(),
      // .passthrough() allows extra fields we don't know about yet
    })
    .passthrough(),
});

// 3. Login
const loginVerifySchema = z.object({
  email: z.string().email(),
  challengeId: z.string().min(1, "Challenge ID is missing"),
  response: z
    .object({
      id: z.string(),
    })
    .passthrough(),
});
// --- Routes ---

export const authRoute = new Hono<{ Bindings: Env; Variables: CustomContext }>()
  .use("*", dbMiddleware)
  .use("*", authMiddleware)

  // CSRF Token
  .get("/csrf-token", (c) => {
    return c.json({ token: getCsrfToken(c) });
  })

  /**
   * 1. REGISTRATION: Get Options
   */
  .post(
    "/register/options",
    zValidator("json", emailSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }
    }),
    async (c) => {
      try {
        const { email } = c.req.valid("json");

        // --- Access Control ---
        if (email.toLowerCase() !== c.env.ALLOWED_EMAIL.toLowerCase()) {
          console.warn(`Blocked registration attempt: ${email}`);
          return c.json({ error: "Registration is currently invite-only." }, 403);
        }

        const db = c.get("db");

        const existingUser = await db.select().from(user).where(eq(user.email, email)).get();
        if (existingUser) {
          return c.json({ error: "An account with this email already exists." }, 409);
        }

        const userID = crypto.randomUUID();
        const options = await generateRegistrationOptions({
          rpName: c.env.RP_NAME,
          rpID: c.env.RP_ID,
          userID: isoUint8Array.fromUTF8String(userID),
          userName: email,
          attestationType: "none",
          excludeCredentials: [],
          authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
          },
        });

        const challengeId = await c.get("setChallenge")(options.challenge);

        return c.json({ ...options, challengeId });
      } catch (e) {
        console.error("Register Options Error:", e);
        return c.json({ error: "Failed to generate registration options." }, 500);
      }
    }
  )

  /**
   * 2. REGISTRATION: Verify
   */
  .post(
    "/register/verify",
    zValidator("json", registerVerifySchema, (result, c) => {
      if (!result.success) return c.json({ error: "Invalid request format" }, 400);
    }),
    async (c) => {
      try {
        // Data is guaranteed to be typed correctly here
        const { email, response, challengeId } = c.req.valid("json");

        const challenge = await c.get("getChallenge")(challengeId);
        if (!challenge) {
          return c.json({ error: "Registration session expired. Please try again." }, 400);
        }

        const verification = await verifyRegistrationResponse({
          response: response as any,
          expectedChallenge: challenge,
          expectedOrigin: c.env.ORIGIN,
          expectedRPID: c.env.RP_ID,
        });

        if (verification.verified && verification.registrationInfo) {
          const { credential } = verification.registrationInfo;
          const { id, publicKey, counter, transports } = credential;

          const db = c.get("db");

          let userId = "";
          const existingUser = await db.select().from(user).where(eq(user.email, email)).get();

          if (!existingUser) {
            userId = crypto.randomUUID();
            await db.insert(user).values({ id: userId, email });
          } else {
            userId = existingUser.id;
          }

          await db.insert(authenticator).values({
            id: crypto.randomUUID(),
            userId: userId,
            credentialId: id,
            credentialPublicKey: isoBase64URL.fromBuffer(publicKey),
            counter: counter,
            transports: JSON.stringify(transports || []),
          });

          await c.get("setSession")(userId);

          return c.json({ verified: true });
        }

        return c.json({ error: "WebAuthn verification failed." }, 400);
      } catch (error: any) {
        console.error("REGISTRATION VERIFICATION FAILED:", error);
        return c.json({ error: "Registration failed due to a server error." }, 500);
      }
    }
  )

  /**
   * 3. LOGIN: Get Options
   */
  .post(
    "/login/options",
    zValidator("json", emailSchema, (result, c) => {
      if (!result.success) return c.json({ error: result.error.issues[0].message }, 400);
    }),
    async (c) => {
      try {
        const { email } = c.req.valid("json");
        const db = c.get("db");

        const foundUser = await db.select().from(user).where(eq(user.email, email)).get();
        if (!foundUser) {
          return c.json({ error: "No account found with this email." }, 404);
        }

        const userAuths = await db
          .select()
          .from(authenticator)
          .where(eq(authenticator.userId, foundUser.id))
          .all();

        if (userAuths.length === 0) {
          return c.json({ error: "No passkeys registered for this account." }, 400);
        }

        const options = await generateAuthenticationOptions({
          rpID: c.env.RP_ID,
          allowCredentials: userAuths.map((auth) => ({
            id: auth.credentialId,
            transports: auth.transports ? JSON.parse(auth.transports) : undefined,
          })),
          userVerification: "preferred",
        });

        const challengeId = await c.get("setChallenge")(options.challenge);

        return c.json({ ...options, challengeId });
      } catch (e) {
        console.error("Login Options Error:", e);
        return c.json({ error: "Failed to generate login options." }, 500);
      }
    }
  )

  /**
   * 4. LOGIN: Verify
   */
  .post(
    "/login/verify",
    zValidator("json", loginVerifySchema, (result, c) => {
      if (!result.success) return c.json({ error: "Invalid request format" }, 400);
    }),
    async (c) => {
      try {
        const { email, response, challengeId } = c.req.valid("json");

        const challenge = await c.get("getChallenge")(challengeId);
        if (!challenge) {
          return c.json({ error: "Login session expired. Please try again." }, 400);
        }

        const db = c.get("db");
        const foundUser = await db.select().from(user).where(eq(user.email, email)).get();

        if (!foundUser) {
          return c.json({ error: "User not found." }, 404);
        }

        const auth = await db
          .select()
          .from(authenticator)
          .where(eq(authenticator.credentialId, response.id))
          .get();

        if (!auth) {
          return c.json({ error: "Passkey not recognized." }, 400);
        }

        const verification = await verifyAuthenticationResponse({
          response: response as any,
          expectedChallenge: challenge,
          expectedOrigin: c.env.ORIGIN,
          expectedRPID: c.env.RP_ID,
          credential: {
            id: auth.credentialId,
            publicKey: isoBase64URL.toBuffer(auth.credentialPublicKey),
            counter: auth.counter,
            transports: auth.transports ? JSON.parse(auth.transports) : undefined,
          },
        });

        if (verification.verified) {
          const { authenticationInfo } = verification;

          await db
            .update(authenticator)
            .set({ counter: authenticationInfo.newCounter })
            .where(eq(authenticator.id, auth.id));

          await c.get("setSession")(foundUser.id);

          return c.json({ verified: true });
        }

        return c.json({ error: "Verification failed." }, 400);
      } catch (err) {
        console.error("Login verification error:", err);
        return c.json({ error: "Login failed due to a server error." }, 500);
      }
    }
  )

  /**
   * 5. GET Current User
   */
  .get("/me", (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "You are not logged in." }, 401);
    }
    return c.json(user);
  })

  /**
   * 6. LOGOUT
   */
  .post("/logout", async (c) => {
    try {
      const destroySession = c.get("destroySession");
      await destroySession();
      return c.json({ success: true });
    } catch (e) {
      console.error("Logout error", e);
      return c.json({ error: "Failed to log out." }, 500);
    }
  });
