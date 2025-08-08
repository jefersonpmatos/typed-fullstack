import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import { organizationSchema } from "./organization.schema";

export const getAllOrganizationsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/organizations",
    {
      schema: {
        tags: ["organizations"],
        summary: "Get all organizations",
        description: "Get all organizations",
        operationId: "getAllOrganizations",
        response: {
          200: z.array(organizationSchema),
          400: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (_, res) => {
      const organizations = await prisma.organization.findMany();
      return res.status(200).send(organizations);
    }
  );
};
