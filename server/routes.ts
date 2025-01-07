import { randomUUID } from "crypto";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

export const routes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "Create user",
        operationId: "createUser",
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({
            id: z.string(),
            name: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { name } = req.body;

      const newUser = {
        id: randomUUID(),
        name,
      };

      users.push(newUser);

      return reply.status(201).send(newUser);
    }
  );

  app.get(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        description: "Get user by id",
        operationId: "getUser",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const user = users.find((user) => user.id === id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return reply.status(200).send(user);
    }
  );

  app.get(
    "/users",
    {
      schema: {
        description: "Get users",
        operationId: "getUsers",
        tags: ["users"],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
            })
          ),
        },
      },
    },
    () => {
      return users;
    }
  );
};
