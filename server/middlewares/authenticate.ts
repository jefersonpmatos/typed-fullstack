import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies?.access_token;
  if (!token) {
    return reply.status(401).send({ message: "Authentication required" });
  }
  try {
    const decoded = req.jwt.verify(token);
    req.user = decoded;
  } catch {
    return reply.status(401).send({ message: "Invalid token" });
  }
}
