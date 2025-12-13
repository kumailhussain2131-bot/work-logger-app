import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

import { usersRouter } from "./endpoints/users/router";
import { workSessionsRouter } from "./endpoints/workSessions/router";

// Start app
const app = new Hono<{ Bindings: Env }>();

// Global error handler
app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode
    );
  }

  console.error(err);
  return c.json(
    { success: false, message: "Internal Server Error" },
    500
  );
});

// OpenAPI setup (Swagger)
const openapi = fromHono(app, {
  docs_url: "/", // Swagger at root
  schema: {
    info: {
      title: "Work Logger API",
      version: "1.0.0",
      description: "Secure backend for work logging & invoicing",
    },
  },
});

// Register routes
openapi.route("/users", usersRouter);
openapi.route("/work-sessions", workSessionsRouter);

export default app;
