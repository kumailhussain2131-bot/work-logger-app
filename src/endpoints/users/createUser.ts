import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class CreateUser extends OpenAPIRoute {
  static schema = {
    tags: ["Users"],
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
        description: "User created successfully",
      },
      400: {
        description: "Invalid input",
      },
    },
  };

  async handle(c: any) {
    const body = await c.req.json<{
      name: string;
      profession: string;
      rate_per_hour: number;
      client: string;
    }>();

    // Basic validation (don’t trust clients)
    if (!body.name || !body.rate_per_hour) {
      return c.json(
        { success: false, message: "Missing required fields" },
        400
      );
    }

    const result = await c.env.DB.prepare(
      `
      INSERT INTO users (name, profession, rate_per_hour, client)
      VALUES (?, ?, ?, ?)
      `
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
  }
}
