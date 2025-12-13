import { fromHono } from "chanfana";
import { Hono } from "hono";

import { CreateUser } from "./endpoints/users/createUser";

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Create OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/", // Swagger UI at root
  schema: {
    info: {
      title: "Work Logger API",
      version: "1.0.0",
      description: "OpenAPI backend for work logging & invoicing",
    },
  },
});

// Register OpenAPI endpoints
openapi.post("/users/create", CreateUser);

// Export app for Cloudflare Workers
export default app;
