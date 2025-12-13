import { fromHono } from "chanfana";
import { Hono } from "hono";

const router = new Hono();
export const usersRouter = fromHono(router);

// Book ON
workSessionsRouter.post("/book-on", async (c) => {
  const { user_id } = await c.req.json<{ user_id: number }>();

  await c.env.DB.prepare(
    `INSERT INTO work_sessions (user_id, start_time)
     VALUES (?, datetime('now'))`
  )
    .bind(user_id)
    .run();

  return c.json({ success: true });
});

// Book OFF
workSessionsRouter.post("/book-off", async (c) => {
  const { user_id } = await c.req.json<{ user_id: number }>();

  await c.env.DB.prepare(
    `
    UPDATE work_sessions
    SET end_time = datetime('now'),
        hours = (julianday(datetime('now')) - julianday(start_time)) * 24
    WHERE user_id = ?
      AND end_time IS NULL
    `
  )
    .bind(user_id)
    .run();

  return c.json({ success: true });
});

// Invoice data
workSessionsRouter.get("/invoice/:user_id", async (c) => {
  const user_id = Number(c.req.param("user_id"));
  const period = c.req.query("period");

  let filter = "";
  if (period === "week") filter = "AND start_time >= date('now','-7 days')";
  if (period === "month") filter = "AND start_time >= date('now','-30 days')";

  const result = await c.env.DB.prepare(
    `
    SELECT 
      ws.start_time,
      ws.end_time,
      ws.hours,
      u.rate_per_hour,
      ws.hours * u.rate_per_hour AS amount
    FROM work_sessions ws
    JOIN users u ON u.id = ws.user_id
    WHERE ws.user_id = ?
    ${filter}
    `
  )
    .bind(user_id)
    .all();

  return c.json({ success: true, data: result.results });
});
