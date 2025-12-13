import { createRoute } from "chanfana";
import { z } from "zod";

export const createUser = createRoute({
  method: "post",
  path: "/users/create",
  summary: "Create a user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string(),
            profession: z.string(),
            rate_per_hour: z.number(),
            client: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "User created",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            user_id: z.number(),
          }),
        },
      },
    },
  },
  handler: async (c) => {
    const body = await c.req.json();

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
  },
});
