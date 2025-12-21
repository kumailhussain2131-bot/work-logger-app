import { MiddlewareHandler } from "hono";

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header("Authorization");

  if (!auth) {
    return c.json({ error: "Missing Authorization header" }, 401);
  }

  const token = auth.replace("Bearer ", "");

  if (token !== c.env.API_KEY) {
    return c.json({ error: "Invalid API key" }, 403);
  }

  await next();
};
