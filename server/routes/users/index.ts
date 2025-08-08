import z from "zod";

import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { errorSchema } from "../../shared/schemas/error-schema";
import { usersController } from "./users.controller";
import { updateUserSchema, userSchema } from "./users.schema";

export const usersRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/:id",
    {
      schema: {
        summary: "Get user",
        description: "Get user by id or email",
        operationId: "getUser",
        tags: ["users"],
        params: z.object({ id: z.string() }),
        response: {
          200: userSchema,
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    usersController.getUser
  );

  app.get(
    "/",
    {
      schema: {
        summary: "Get all users",
        description: "Get all users ",
        operationId: "getUsers",
        tags: ["users"],
        response: {
          200: userSchema.array(),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    usersController.getAll
  );

  app.patch(
    "/:id",
    {
      schema: {
        summary: "Update user",
        description: "Partially update user infos",
        operationId: "updateUser",
        tags: ["users"],
        params: z.object({ id: z.string() }),
        body: updateUserSchema,
        response: {
          200: userSchema,
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    usersController.updateUser
  );

  app.delete(
    "/:id",
    {
      schema: {
        summary: "Delete user",
        description: "Delete user by id",
        operationId: "deleteUser",
        tags: ["users"],
        params: z.object({ id: z.string() }),
        response: {
          204: z.null(),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    usersController.deleteUser
  );
};
