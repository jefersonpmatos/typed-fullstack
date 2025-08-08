import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/database";
import { loginSchema, RegisterUserSchema } from "./auth.schema";

export const authController = {
  async register(
    req: FastifyRequest<{ Body: RegisterUserSchema }>,
    res: FastifyReply
  ) {
    const { email, name, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(409).send({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password: hash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(500).send({ message: "Error creating user" });
    }

    return res.status(201).send(user);
  },

  async login(
    req: FastifyRequest<{ Body: typeof loginSchema._type }>,
    res: FastifyReply
  ) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!user || !isMatch) {
      return res.code(401).send({ message: "Invalid email or password" });
    }

    const payload = { id: user.id, email: user.email, name: user.name };
    const token = req.jwt.sign(payload);

    res.setCookie("access_token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
    });

    return { accessToken: token };
  },

  async logout(_: FastifyRequest, res: FastifyReply) {
    res.clearCookie("access_token");
    return res.send({ message: "Logout successful" });
  },
};
