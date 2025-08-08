import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";

export const deleteOrganizationRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/organizations/:id",
    {
      schema: {
        tags: ["organizations"],
        summary: "Delete organization",
        description: "Delete organization by id",
        operationId: "deleteOrganization",
        params: z.object({
          id: z.string().min(1, "ID da organização não pode estar vazio"),
        }),
        response: {
          204: z.null(),
          400: errorSchema,
          404: errorSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const organization = await prisma.organization.delete({ where: { id } });

      if (!organization)
        return res.status(404).send({ message: "Organization not found" });

      return res.status(204).send();
    }
  );
};
