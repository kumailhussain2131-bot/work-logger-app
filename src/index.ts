import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { usersRoutes } from "./endpoints/users";

const app = new Hono<{ Bindings: Env }>();

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

// register ALL user routes
for (const route of usersRoutes) {
  openapi.route("/", route);
}

export default app;
