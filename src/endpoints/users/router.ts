import { Hono } from "hono";
import { createUser } from "./createUser";

export const usersRouter = new Hono();

usersRouter.route("/", createUser);
