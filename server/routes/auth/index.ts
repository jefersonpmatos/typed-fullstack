import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { errorSchema } from "../../shared/schemas/error-schema";
import { userSchema } from "../users/users.schema";
import { authController } from "./auth.controller";
import { loginSchema, registerUserSchema } from "./auth.schema";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Register",
        description: "Register a new user",
        operationId: "createUser",
        body: registerUserSchema,
        response: {
          201: userSchema,
          400: errorSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    authController.register
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Login",
        description: "Login user",
        operationId: "loginUser",
        body: loginSchema,
        response: {
          200: z.object({
            user: userSchema.omit({ createdAt: true, updatedAt: true }),
            accessToken: z.string(),
          }),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    authController.login
  );

  app.delete(
    "/logout",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["auth"],
        summary: "Logout",
        description: "Logout user",
        operationId: "logoutUser",
        response: {
          200: z.null(),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    authController.logout
  );

  app.log.info("Auth routes registered successfully ");
};
