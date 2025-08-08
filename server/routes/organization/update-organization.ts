import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import { organizationSchema } from "./organization.schema";

export const updateOrganizationRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    "/organizations/:id",
    {
      schema: {
        tags: ["organizations"],
        summary: "Update organization",
        description: "Update organization",
        operationId: "updateOrganization",
        params: z.object({
          id: z.string().min(1, "Organization ID cannot be empty"),
        }),
        body: z.object({
          name: z
            .string()
            .min(1, "Organization name is required")
            .max(100, "Name must be less than 100 characters"),
        }),
        response: {
          200: organizationSchema,
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const organizationExists = await prisma.organization.findUnique({
        where: { id },
      });

      if (!organizationExists) {
        return res.status(404).send({ message: "Organization not found" });
      }

      if (organizationExists?.name === data.name) {
        return res
          .status(400)
          .send({ message: "Organization name already exists" });
      }

      const organization = await prisma.organization.update({
        where: { id },
        data,
      });

      return res.status(200).send(organization);
    }
  );
};
