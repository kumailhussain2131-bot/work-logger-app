import { Hono } from "hono";
import { apiKeyAuth } from "./middleware/auth";

const app = new Hono();

// 🔒 Secure everything
app.use("*", apiKeyAuth);

// Health check (still protected)
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
