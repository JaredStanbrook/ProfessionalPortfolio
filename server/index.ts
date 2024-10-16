import { Hono } from "hono";
import { logger } from "hono/logger";

import { employeeRoute } from "./routes/employee";
import type { DrizzleD1Database } from "drizzle-orm/d1";
//import { authRoute } from "./routes/auth"

const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use("*", logger());
app.get("/*", async (c) => {
    return c.env.ASSETS.fetch(c.req.raw);
});
//const apiRoutes = app.basePath("/api"); //.route("/employee", employeeRoute); //.route("/", authRoute)
export default app;
//export type ApiRoutes = typeof apiRoutes;
