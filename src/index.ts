import { fromHono, ApiException } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

import { createUser } from "./endpoints/users/createUser";

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
    { success: false, errors: [{ code: 7000, message: "Internal error" }] },
    500
  );
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Secure Work Logging & Invoicing API",
      version: "1.0.0",
    },
  },
});

// 🔥 THIS LINE IS WHY YOUR SPEC WAS EMPTY
openapi.route("/", createUser);

export default app;
