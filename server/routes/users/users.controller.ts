import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/database";
import { UpdateUserSchema } from "./users.schema";

export const usersController = {
  async getUser(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).send(user);
  },

  async getAll(_: FastifyRequest, res: FastifyReply) {
    const users = await prisma.user.findMany();
    return res.status(200).send(users);
  },

  async updateUser(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserSchema }>,
    res: FastifyReply
  ) {
    const { id } = req.params;
    const { email, name } = req.body;

    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email: email.toLowerCase().trim() }),
        ...(name && { name: name.trim() }),
      },
    });
    return res.status(200).send(user);
  },

  async deleteUser(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: { id },
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    return res.status(200).send({ message: "User deleted successfully" });
  },
};
