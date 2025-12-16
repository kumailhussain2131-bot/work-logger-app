import { MiddlewareHandler } from "hono";

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== c.env.API_KEY) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
};
