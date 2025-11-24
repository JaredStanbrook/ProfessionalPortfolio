// This file is optional now - cloudflare:test provides what we need
// You can add global test setup here if needed

import { beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  // Global setup if needed
  console.log("Starting test suite...");
});

afterAll(async () => {
  // Global cleanup if needed
  console.log("Test suite complete!");
});
