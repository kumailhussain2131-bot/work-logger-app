import { Hono } from "hono";

export const createUser = new Hono();

createUser.post("/users/create", async (c) => {
  const body = await c.req.json<{
    name: string;
    profession: string;
    rate_per_hour: number;
    client: string;
  }>();

  if (!body.name || !body.rate_per_hour) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const result = await c.env.DB.prepare(
    `
    INSERT INTO users (name, profession, rate_per_hour, client, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    `
  )
    .bind(
      body.name,
      body.profession ?? "",
      body.rate_per_hour,
      body.client ?? ""
    )
    .run();

  return c.json({
    success: true,
    user_id: result.meta.last_row_id,
  });
});
