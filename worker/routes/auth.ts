// worker/routes/auth.ts
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { requireRole } from "../middleware/guard.middleware";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import {
  loginUserSchema,
  registerUserSchema,
  registerPasskeyOptionsSchema,
  registerPasskeyVerifySchema,
  loginPasskeyOptionsSchema,
  loginPasskeyVerifySchema,
  safeUserSchema,
  updateUserProfileSchema,
  changePasswordRequestSchema,
  changePinRequestSchema,
} from "../schema/auth.schema";
import type { AppEnv } from "../types";
import { setCookie } from "hono/cookie";

// --- Routes ---
export const passkey = new Hono<AppEnv>()
  .use("*", async (c, next) => {
    // Middleware check
    const isMethodEnabled = c.get("isMethodEnabled");
    if (!isMethodEnabled("passkey")) {
      return c.json({ error: "Passkey auth is not enabled" }, 404);
    }
    await next();
  })

  // 1. Register Options
  .post("/register/options", zValidator("json", registerPasskeyOptionsSchema), async (c) => {
    try {
      const { email } = c.req.valid("json");
      const { auth } = c.var;

      const result = await auth.generatePasskeyRegistrationOptions(email);

      // Return options directly, challengeId is included in result
      return c.json({ ...result.options, challengeId: result.challengeId });
    } catch (e: any) {
      return c.json({ error: e.message || "Registration initialization failed" }, 400);
    }
  })

  // 2. Register Verify
  .post("/register/verify", zValidator("json", registerPasskeyVerifySchema), async (c) => {
    try {
      const { email, response, challengeId } = c.req.valid("json");
      const { auth } = c.var;

      const { verified, sessionToken } = await auth.verifyPasskeyRegistration(
        email,
        response as any, // Cast to 'any' here as Zod has already validated structure
        challengeId
      );

      // Set Cookie
      const cookie = auth.createSessionCookie(sessionToken);
      setCookie(c, cookie.name, cookie.value, cookie.attributes);

      return c.json({ verified });
    } catch (e: any) {
      console.error("Register Verify Error:", e);
      return c.json({ error: e.message || "Registration verification failed" }, 400);
    }
  })

  // 3. Login Options
  .post("/login/options", zValidator("json", loginPasskeyOptionsSchema), async (c) => {
    try {
      const { email } = c.req.valid("json");
      const { auth } = c.var;

      const result = await auth.generatePasskeyLoginOptions(email);

      return c.json({ ...result.options, challengeId: result.challengeId });
    } catch (e: any) {
      return c.json({ error: e.message || "Login initialization failed" }, 400);
    }
  })

  // 4. Login Verify
  .post("/login/verify", zValidator("json", loginPasskeyVerifySchema), async (c) => {
    try {
      const { email, response, challengeId } = c.req.valid("json");
      const { auth } = c.var;

      const { verified, sessionToken } = await auth.verifyPasskeyLogin(
        email,
        response as any,
        challengeId
      );

      // Set Cookie
      const cookie = auth.createSessionCookie(sessionToken);
      setCookie(c, cookie.name, cookie.value, cookie.attributes);

      return c.json({ verified });
    } catch (e: any) {
      console.error("Login Verify Error:", e);
      return c.json({ error: e.message || "Login verification failed" }, 400);
    }
  });

/**
 * TOTP setup
 */
export const totp = new Hono<AppEnv>().use("*", async (c, next) => {
  const isMethodEnabled = c.get("isMethodEnabled");
  if (!isMethodEnabled("totp")) {
    return c.json({ error: "TOTP is not enabled" }, 404);
  }
  await next();
});
/*
  .post("/setup", authMiddleware, async (c) => {
    const { auth } = c.var;
    const db = c.get("db");
    const userId = auth.user?.id;

    try {
      //const result = await authService.setupTotp(db, userId); TODO setup totp
      //return c.json(result);
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  });

  .post("/verify", authMiddleware, zValidator("json", verifyTotpSchema), async (c) => {
    const db = c.get("db");
    const userId = c.get("userId");
    const { code } = c.req.valid("json");

    try {
      await authService.verifyTotp(db, userId, code);
      return c.json({ message: "TOTP enabled successfully" });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  });

  .delete("/disable", authMiddleware, async (c) => {
    const db = c.get("db");
    const userId = c.get("userId");

    try {
      await authService.disableTotp(db, userId);
      return c.json({ message: "TOTP disabled successfully" });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  })
}
*/
export const auth = new Hono<AppEnv>()
  .use("*", authMiddleware)
  .get("/methods", (c) => {
    const { authConfig } = c.var;

    // Filter out any role listed in 'restricted'
    const publicRoles = authConfig.roles.available.filter(
      (role) => !authConfig.roles.restricted.includes(role)
    );

    return c.json({
      methods: Array.from(authConfig.methods),
      requireEmailVerification: authConfig.security.requireEmailVerification,
      requirePhoneVerification: authConfig.security.requirePhoneVerification,

      roles: publicRoles,
      defaultRole: authConfig.roles.default,
    });
  })
  .route("/passkey", passkey)
  .route("/totp", totp)
  .post(
    "/register",
    //rateLimitMiddleware(5, 60000),
    zValidator("json", registerUserSchema),
    async (c) => {
      const { auth } = c.var;
      const body = c.req.valid("json");

      try {
        const result = await auth.register(body);
        return c.json(result, 201);
      } catch (error: any) {
        return c.json({ error: error.message }, 400);
      }
    }
  )

  .post("/login", zValidator("json", loginUserSchema), async (c) => {
    const { auth } = c.var;
    const body = await c.req.valid("json");

    const isMethodEnabled = c.get("isMethodEnabled");

    try {
      let result;
      // Route to appropriate login method
      if (body.password && isMethodEnabled("password")) {
        result = await auth.loginWithPassword(body.email, body.password);
      } else if (body.pin && isMethodEnabled("pin")) {
        result = await auth.loginWithPin(body.email, body.pin);
      } else if (body.totpCode && isMethodEnabled("totp")) {
        result = await auth.loginWithTotp(body.email, body.totpCode);
      } else {
        return c.json({ error: "Invalid authentication method" }, 400);
      }

      const cookie = auth.createSessionCookie(result.sessionToken);
      setCookie(c, cookie.name, cookie.value, cookie.attributes);

      return c.json(result);
    } catch (error: any) {
      return c.json({ error: error.message }, 401);
    }
  })
  .get("/me", (c) => {
    const user = c.var.auth.user;
    if (!user) {
      return c.json({ error: "You are not logged in." }, 401);
    }
    const cleanUser = safeUserSchema.parse(user);
    return c.json(cleanUser);
  })
  .patch("/me", zValidator("json", updateUserProfileSchema), async (c) => {
    const user = c.var.auth.user;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const payload = c.req.valid("json");
    const { auth } = c.var;

    try {
      await auth.updateProfile(user.id, payload);
      return c.json({ success: true, user: auth.user });
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  })
  .delete("/me", async (c) => {
    const user = c.var.auth.user;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const { auth } = c.var;

    try {
      await auth.deleteAccount(user.id);

      // Clear cookie
      const cookie = auth.createBlankSessionCookie();
      setCookie(c, cookie.name, cookie.value, cookie.attributes);

      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ error: e.message }, 500);
    }
  })
  .post("/change-password", zValidator("json", changePasswordRequestSchema), async (c) => {
    const user = c.var.auth.user;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const payload = c.req.valid("json");
    const { auth } = c.var;

    try {
      await auth.changePassword(user.id, payload);
      return c.json({ success: true });
    } catch (e: any) {
      // Return 400 for wrong password, etc.
      return c.json({ error: e.message }, 400);
    }
  })
  .post("/change-pin", zValidator("json", changePinRequestSchema), async (c) => {
    const user = c.var.auth.user;
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const payload = c.req.valid("json");
    const { auth } = c.var;

    try {
      await auth.changePin(user.id, payload);
      return c.json({ success: true });
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  })

  .post("/logout", async (c) => {
    try {
      const { auth } = c.var;
      if (auth.session) {
        await auth.invalidateSession(auth.session.id);
      }
      // Clear cookie
      const cookie = auth.createBlankSessionCookie();
      setCookie(c, cookie.name, cookie.value, cookie.attributes);
      return c.json({ success: true });
    } catch (e) {
      console.error("Logout error", e);
      return c.json({ error: "Failed to log out." }, 500);
    }
  })

  /**
   * Email/Phone verification
   
  .post(
    "/verification/request",
    authMiddleware,
    //rateLimitMiddleware(3, 300000), // 3 requests per 5 minutes
    zValidator("json", requestVerificationSchema),
    async (c) => {
      const db = c.get("db");
      const userId = c.get("userId");
      const body = c.req.valid("json");

      try {
        await authService.sendVerificationCode(db, userId, body);
        return c.json({ message: `Verification code sent to your ${body.type}` });
      } catch (error: any) {
        return c.json({ error: error.message }, 400);
      }
    }
  )

  .post("/verification/verify", authMiddleware, zValidator("json", verifyCodeSchema), async (c) => {
    const db = c.get("db");
    const userId = c.get("userId");
    const body = c.req.valid("json");

    try {
      await authService.verifyCode(db, userId, body.code, body.type);
      return c.json({ message: `${body.type} verified successfully` });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  })
  */
  /**
   * Auth logs (admin/security monitoring)
   */
  .get("/logs", authMiddleware, zValidator("query", z.object({})), async (c) => {
    //zValidator("query", queryAuthLogsSchema),
    const { auth } = c.var;
    const query = c.req.valid("query");

    try {
      const logs = await auth.getAuthLogs(query);
      return c.json({ logs });
    } catch (error: any) {
      return c.json({ error: error.message }, 400);
    }
  });
