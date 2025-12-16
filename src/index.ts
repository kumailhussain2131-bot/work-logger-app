import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { usersRoutes } from "./endpoints/users";
import { apiKeyAuth } from "./middleware/auth";

const app = new Hono<{ Bindings: Env }>();

// 🔐 AUTH MUST BE HERE (ON app)
app.use("*", apiKeyAuth);

app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode
    );
  }

  console.error(err);
  return c.json(
    { success: false, errors: [{ message: "Internal Server Error" }] },
    500
  );
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Secure Work Logger API",
      version: "1.0.0",
    },
  },
});

// ❌ DO NOT put middleware here
// openapi.use("*", apiKeyAuth);  ← DELETE THIS

for (const route of usersRoutes) {
  openapi.route("/", route);
}

export default app;
