import { expect, test } from "vitest";
import app from "./index";

const MOCK_ENV = {
  ENVIRONMENT: "staging",
};
test("GET /api/auth/me", async () => {
  const res = await app.request("/api/auth/me", {}, MOCK_ENV);
  expect(res.status).toBe(401);
});
