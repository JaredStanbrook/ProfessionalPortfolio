import { createMiddleware } from "hono/factory";

type Env = {
    Variables: {
        user: { id: number, given_name: string, family_name: string, picture?: string};
    };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
    try {
        const user = { id: 1, given_name: "admin", family_name: "admin"};
        c.set("user", user);
        await next();
    } catch (e) {
        console.error(e);
        return c.json({ error: "Unauthorized" }, 401);
    }
});
