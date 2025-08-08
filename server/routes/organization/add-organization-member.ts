import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import { membershipSchema, roleSchema } from "./organization.schema";

export const addOrganizationMemberRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.post(
    "/organizations/:id/members",
    {
      schema: {
        tags: ["organizations"],
        summary: "Add member to organization",
        description: "Add member to organization",
        operationId: "addOrganizationMember",
        params: z.object({
          id: z.string().min(1, "organization ID is required"),
        }),
        body: z.object({
          userId: z.string().min(1, "User ID is required"),
          role: roleSchema.default("MEMBER"),
        }),
        response: {
          201: membershipSchema,
          400: errorSchema,
          404: errorSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const { userId, role } = req.body;

      const organization = await prisma.organization.findUnique({
        where: { id },
      });

      if (!organization)
        return res.status(404).send({ message: "Organization not found" });

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) return res.status(404).send({ message: "User not found" });

      const membership = await prisma.membership.create({
        data: {
          organizationId: id,
          userId,
          role,
        },
      });

      return res.status(201).send(membership);
    }
  );
};
