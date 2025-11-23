import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

// Schemas
import { session } from "./schema/session";
import { user, type User } from "./schema/user";

// Types
export type CustomContext = {
  db: ReturnType<typeof drizzle>;
  user: User | null;
  session: { id: string } | null;
  setSession: (userId: string) => Promise<void>;
  destroySession: () => Promise<void>;
  // WebAuthn Helpers
  setChallenge: (challenge: string) => void;
  getChallenge: () => string | undefined;
};

const SESSION_COOKIE = "session"; //__Secure-session user for PROD
const CHALLENGE_COOKIE = "challenge"; //__Secure-challenge use for PROD
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const CSRF_COOKIE = "csrf_token"; // __Host-csrf_token for PROD
const CSRF_HEADER = "x-csrf-token";

// --- Crypto Helpers ---
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function randomString(length = 24): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += ALPHABET[bytes[i] >> 3];
  return s;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(secret)));
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const dbMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: CustomContext;
}>(async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: CustomContext;
}>(async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);

  // 1. Initialize context
  let currentUser: User | null = null;
  let currentSessionId: string | null = null;

  // 2. Check for existing session cookie
  const sessionToken = getCookie(c, SESSION_COOKIE);

  if (sessionToken) {
    const [id, secret] = sessionToken.split(".");
    if (id && secret) {
      // Join session with user to get auth info in one query
      const result = await db
        .select({
          sessionHash: session.secretHash,
          sessionCreatedAt: session.createdAt,
          user: user,
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(eq(session.id, id))
        .get();

      if (result) {
        const ageOk = Date.now() - new Date(result.sessionCreatedAt).getTime() < MAX_AGE * 1000;
        // Verify secret
        const hashOk = constantTimeEqual(
          await hashSecret(secret),
          isoBase64URL.toBuffer(result.sessionHash)
        );

        if (ageOk && hashOk) {
          currentUser = result.user;
          currentSessionId = id;
        }
      }
    }
  }

  // 3. Set Context Variables
  c.set("user", currentUser);
  c.set("session", currentSessionId ? { id: currentSessionId } : null);

  // 4. Define Helper: Create Session (Login)
  c.set("setSession", async (userId: string) => {
    const id = randomString(32);
    const secret = randomString(32);

    // 1. Hash the secret (Returns Uint8Array)
    const secretHash = await hashSecret(secret);

    // 2. Convert Uint8Array to Base64URL string for Drizzle/D1 insertion
    const sessionSecretString = isoBase64URL.fromBuffer(secretHash as Uint8Array<ArrayBuffer>);

    await db.insert(session).values({
      id,
      userId,
      secretHash: sessionSecretString,
    });

    setCookie(c, SESSION_COOKIE, `${id}.${secret}`, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
      maxAge: MAX_AGE,
    });
  });

  // 5. Define Helper: Destroy Session (Logout)
  c.set("destroySession", async () => {
    if (currentSessionId) {
      await db.delete(session).where(eq(session.id, currentSessionId));
    }
    deleteCookie(c, SESSION_COOKIE);
    c.set("user", null);
    c.set("session", null);
  });

  // 6. Define Helpers: WebAuthn Challenge (Ephemeral cookie)
  c.set("setChallenge", (challenge: string) => {
    setCookie(c, CHALLENGE_COOKIE, challenge, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 60 * 5, // 5 minutes expiry for challenge
    });
  });

  c.set("getChallenge", () => {
    const val = getCookie(c, CHALLENGE_COOKIE);
    // Delete immediately after retrieval to prevent replay
    deleteCookie(c, CHALLENGE_COOKIE);
    return val;
  });

  await next();
});

export const csrfMiddleware = createMiddleware(async (c, next) => {
  const method = c.req.method;

  // Only protect state-changing methods
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    // Get token from cookie
    const cookieToken = getCookie(c, CSRF_COOKIE);

    // Get token from header or body
    const headerToken = c.req.header(CSRF_HEADER);
    const bodyToken = c.req.query("csrf_token"); // Fallback for form submissions

    const requestToken = headerToken || bodyToken;

    if (!cookieToken || !requestToken || cookieToken !== requestToken) {
      return c.json({ error: "CSRF token validation failed" }, 403);
    }
  }

  await next();

  // Set/refresh CSRF token on every response
  let token = getCookie(c, CSRF_COOKIE);
  if (!token) {
    token = generateCsrfToken();
  }

  setCookie(c, CSRF_COOKIE, token, {
    path: "/",
    secure: true,
    httpOnly: false, // Must be false so JavaScript can read it
    sameSite: "Strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
});

export const getCsrfToken = (c: any) => {
  return getCookie(c, CSRF_COOKIE) || generateCsrfToken();
};
