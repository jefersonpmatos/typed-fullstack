import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import { organizationSchema } from "./organization.schema";

export const getOrganizationRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/organizations/:id",
    {
      schema: {
        tags: ["organizations"],
        summary: "Get organization",
        description: "Get organization",
        operationId: "getOrganization",
        params: z.object({
          id: z.string().min(1, "Organization ID is required  "),
        }),
        response: {
          200: organizationSchema,
          400: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;

      const organization = await prisma.organization.findUnique({
        where: { id },
      });

      if (!organization)
        return res.status(404).send({ message: "Organization not found" });

      return res.status(200).send(organization);
    }
  );
};
