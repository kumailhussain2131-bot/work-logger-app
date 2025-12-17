import type { Context, Next } from "hono";

export const apiKeyAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    return c.json({ error: "Missing Authorization header" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!c.env || token !== c.env.API_KEY) {
    return c.json({ error: "Invalid API key" }, 401);
  }

  await next();
};
