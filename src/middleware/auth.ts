import { MiddlewareHandler } from "hono";

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    return c.json(
      { success: false, error: "Missing Authorization header" },
      401
    );
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== c.env.API_KEY) {
    return c.json(
      { success: false, error: "Invalid API key" },
      401
    );
  }

  await next();
};
