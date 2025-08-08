import { Prisma } from "@prisma/client";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import {
  createOrganizationSchema,
  organizationSchema,
} from "./organization.schema";
export const createOrganizationRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/organizations",
    {
      schema: {
        tags: ["organizations"],
        summary: "Create organization",
        description: "Create organization a new organization",
        operationId: "createOrganization",
        body: createOrganizationSchema,
        response: {
          201: organizationSchema,
          400: errorSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const data = req.body;

      try {
        const organization = await prisma.organization.create({
          data,
        });
        return res.status(201).send(organization);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            return res.status(409).send({
              message: "Organization already exists",
            });
          }

          return res.status(400).send({ message: "Error in database" });
        }

        if (error instanceof SyntaxError) {
          return res.status(400).send({ message: "Error in request syntax" });
        }

        req.log.error(error);
        return res.status(500).send({
          message: "Internal server error",
        });
      }
    }
  );
};
