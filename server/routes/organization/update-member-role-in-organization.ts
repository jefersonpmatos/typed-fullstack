import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../lib/database";
import { membershipSchema, roleSchema } from "./organization.schema";

export const updateMemberRoleInOrganizationRoute: FastifyPluginAsyncZod =
  async (app) => {
    app.patch(
      "/organizations/:organizationId/members/:userId",
      {
        schema: {
          tags: ["organizations"],
          summary: "Update member role in organization",
          description: "Update member role in organization",
          operationId: "updateMemberRole",
          params: z.object({
            organizationId: z.string().min(1, "Organization ID is required"),
            userId: z.string().min(1, "User ID is required"),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            200: membershipSchema,
            400: z.object({ message: z.string() }),
            404: z.object({ message: z.string() }),
            500: z.object({ message: z.string() }),
          },
        },
      },
      async (req, res) => {
        const { organizationId, userId } = req.params;
        const { role } = req.body;

        const member = await prisma.membership.findFirst({
          where: { organizationId, userId },
        });

        if (!member) {
          return res.status(404).send({ message: "Member not found" });
        }

        if (member.role === role) {
          return res
            .status(400)
            .send({ message: "User already has this role" });
        }

        const updatedMember = await prisma.membership.update({
          where: { id: member.id },
          data: { role },
        });

        return res.status(200).send(updatedMember);
      }
    );
  };
