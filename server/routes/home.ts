import { Hono } from "hono";
import { dbMiddleware } from "../db";
import { upgradeWebSocket } from "hono/cloudflare-workers";

const activeClients: Set<WebSocket> = new Set();

export const homeRoute = new Hono<{ Bindings: CloudflareBindings }>()
    .use("*", dbMiddleware)
    .get("/", async (c) => {
        const data = await c.env.professional_portfolio_kv.get("motion_sensor");
        if (data) {
            return c.json({ data: JSON.parse(data) }, 200);
        } else {
            return c.json({ error: "No data found." }, 404);
        }
    })
    // WebSocket endpoint for real-time updates
    .get(
        "/api/home/ws",
        upgradeWebSocket(() => {
            return {
                onMessage: (evt, ws) => {
                    console.log(`Message from client: ${evt.data}`);
                    ws.send("Acknowledged: " + evt.data);
                    activeClients.add(ws.raw as WebSocket);
                },
                onClose: (event, ws) => {
                    console.log("Connection closed");
                    activeClients.delete(ws.raw as WebSocket);
                },
            };
        })
    )
    .post("/", async (c) => {
        try {
            const body = await c.req.json();
            if (!Array.isArray(body)) {
                return c.json({ error: "Invalid data format. Expected an array." }, 400);
            }
            const invalidItems = body.filter(
                (item) => typeof item.name !== "string" || typeof item.value !== "number"
            );
            if (invalidItems.length > 0) {
                return c.json({ error: "Some items in the array are invalid.", invalidItems }, 400);
            }
            const key = "motion_sensor";
            await c.env.professional_portfolio_kv.put(key, JSON.stringify(body));

            console.log(`Data stored in KV with key: ${key}`);

            // Broadcast new state to all WebSocket clients
            activeClients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(body));
                }
            });
            return c.json({ message: "Data stored and broadcasted successfully!" }, 201);
        } catch (error) {
            console.error("Error handling /api/home POST request:", error);
            return c.json({ error: "Failed to process the request." }, 500);
        }
    });
export type HomeApp = typeof homeRoute;
