// middleware/auth.middleware.ts
import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { Auth } from "../services/auth.service";
import type { AppEnv } from "../types";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const db = c.get("db");
  const kv = c.env.KV;
  const authConfig = c.get("authConfig");
  const isMethodEnabled = c.get("isMethodEnabled");

  // Create Auth instance
  const auth = new Auth(c, db, kv, authConfig, isMethodEnabled);

  // Check for existing session cookie
  const cookieHeader = c.req.header("cookie");
  if (cookieHeader) {
    const sessionToken = auth.readSessionCookie(cookieHeader);
    if (sessionToken) {
      // Validate session and populate auth.user and auth.session
      await auth.validateSession(sessionToken);
    }
  }

  // Set auth on context
  c.set("auth", auth);

  await next();
});

// Usage example routes:
/*
import { setCookie } from "hono/cookie";

app.post("/api/login", async (c) => {
  const { auth } = c.var;
  const { identifier, password } = await c.req.json();
  
  const result = await auth.loginWithPassword(identifier, password);
  
  // Set session cookie
  const cookie = auth.createSessionCookie(result.sessionToken);
  setCookie(c, cookie.name, cookie.value, cookie.attributes);
  
  return c.json({ user: result.user });
});

app.post("/api/logout", async (c) => {
  const { auth } = c.var;
  
  if (auth.session) {
    await auth.invalidateSession(auth.session.id);
  }
  
  // Clear cookie
  const cookie = auth.createBlankSessionCookie();
  setCookie(c, cookie.name, cookie.value, cookie.attributes);
  
  return c.json({ success: true });
});

app.get("/api/me", async (c) => {
  const { auth } = c.var;
  
  if (!auth.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  return c.json({ user: auth.user });
});

app.post("/api/register", async (c) => {
  const { auth } = c.var;
  const data = await c.req.json();
  
  const result = await auth.register(data);
  return c.json(result);
});
*/
