import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          bindings: {
            ENVIRONMENT: "test",
            RP_NAME: "Test App",
            RP_ID: "example.com",
            ORIGIN: "http://example.com",
            ALLOWED_EMAIL: "test@example.com",
          },
        },
      },
    },
  },
  resolve: {
    alias: {
      tslib: "tslib/tslib.es6.js",
    },
  },
});
