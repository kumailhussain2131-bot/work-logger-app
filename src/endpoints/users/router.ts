import { fromHono } from "chanfana";
import { Hono } from "hono";

const router = new Hono();
export const usersRouter = fromHono(router);

// Create user
usersRouter.post("/create", async (c) => {
  const body = await c.req.json<{
    name: string;
    profession: string;
    rate_per_hour: number;
    client: string;
  }>();

  const result = await c.env.DB.prepare(
    `INSERT INTO users (name, profession, rate_per_hour, client)
     VALUES (?, ?, ?, ?)`
  )
    .bind(
      body.name,
      body.profession,
      body.rate_per_hour,
      body.client
    )
    .run();

  return c.json({
    success: true,
    user_id: result.meta.last_row_id,
  });
});
