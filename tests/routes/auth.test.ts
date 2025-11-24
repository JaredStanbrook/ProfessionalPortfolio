import { describe, it, expect } from "vitest";
import { env, SELF } from "cloudflare:test";

describe("Auth Routes", () => {
  describe("GET /api/auth/csrf-token", () => {
    it("should return a CSRF token", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/csrf-token");

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("token");
      expect(typeof data.token).toBe("string");
    });
  });

  describe("POST /api/auth/register/options", () => {
    it("should reject empty email", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Email required");
    });

    it("should reject non-allowed email", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "notallowed@example.com" }),
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe("Registration is invite-only.");
    });

    it("should accept allowed email from environment", async () => {
      // The allowed email is set in .dev.vars or wrangler.jsonc
      const response = await SELF.fetch("http://example.com/api/auth/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: env.ALLOWED_EMAIL }),
      });

      // Should not return 403 (forbidden)
      expect(response.status).not.toBe(403);
    });

    it("should be case-insensitive for email", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: env.ALLOWED_EMAIL.toUpperCase(),
        }),
      });

      // Should not return 403 (forbidden)
      expect(response.status).not.toBe(403);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 when not authenticated", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/me");

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return success", async () => {
      const response = await SELF.fetch("http://example.com/api/auth/logout", {
        method: "POST",
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("Environment Configuration", () => {
    it("should have correct environment variables from wrangler config", () => {
      // These come from wrangler.jsonc or .dev.vars
      expect(env.ENVIRONMENT).toBeDefined();
      expect(env.RP_NAME).toBeDefined();
      expect(env.RP_ID).toBeDefined();
      expect(env.ORIGIN).toBeDefined();
      expect(env.ALLOWED_EMAIL).toBeDefined();
    });

    it("should have working bindings", () => {
      expect(env.DB).toBeDefined();
      expect(env.KV).toBeDefined();
      expect(env.BLOG).toBeDefined();
    });
  });
});
