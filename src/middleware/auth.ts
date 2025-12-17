import { Context, Next } from "hono";

export const apiKeyAuth = async (c: Context, next: Next) => {
  return c.json(
    {
      message: "AUTH MIDDLEWARE IS RUNNING",
      authorizationHeader: c.req.header("authorization") ?? null,
    },
    418
  );
};
