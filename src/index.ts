import { fromHono } from "chanfana";
import { Hono } from "hono";

import { CreateUser } from "./endpoints/users/createUser";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Work Logger API",
      version: "1.0.0",
    },
  },
});

// ✅ CORRECT WAY TO REGISTER OPENAPI ROUTES
openapi.route("/users/create", CreateUser);

export default app;
