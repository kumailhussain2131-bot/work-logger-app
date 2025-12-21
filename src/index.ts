import { Hono } from "hono";
import { apiKeyAuth } from "./middleware/auth";
import { usersRoutes } from "./endpoints/users";

const app = new Hono();

// 🔒 PROTECT EVERYTHING
app.use("*", apiKeyAuth);

// Register routes
for (const route of usersRoutes) {
  app.route("/", route);
}

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
