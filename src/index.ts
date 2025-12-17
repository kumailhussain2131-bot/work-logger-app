import { Hono } from "hono";
import { apiKeyAuth } from "./middleware/auth";

const app = new Hono();

// 🔒 Apply middleware at root level
app.use("*", apiKeyAuth);

// 🧪 Test endpoint
app.post("/ping", (c) => {
  return c.json({ success: true });
});

export default app;
