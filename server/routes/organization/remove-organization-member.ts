import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";

const paramsSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const removeOrganizationMemberRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.delete(
    "/organizations/:organizationId/members/:userId",
    {
      schema: {
        tags: ["organizations"],
        summary: "Remove member from organization",
        description: "Remove member from organization",
        operationId: "removeOrganizationMember",
        params: paramsSchema,
        response: {
          204: z.null(),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { organizationId, userId } = req.params;

      try {
        const member = await prisma.membership.findFirst({
          where: { organizationId, userId },
        });

        if (!member) {
          return res.status(404).send({ message: "Member not found" });
        }

        await prisma.membership.delete({
          where: { id: member.id },
        });

        return res.status(204).send();
      } catch (error) {
        return res
          .status(500)
          .send({ message: "Erro ao remover membro da organização" });
      }
    }
  );
};
