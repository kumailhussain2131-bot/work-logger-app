import type { Context, Next } from "hono";

export const apiKeyAuth = async (c: Context, next: Next) => {
  return c.json(
    {
      message: "AUTH MIDDLEWARE HIT",
      header: c.req.header("authorization") ?? "none",
    },
    418
  );
};
