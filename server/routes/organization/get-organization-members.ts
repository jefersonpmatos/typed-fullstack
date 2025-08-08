import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { prisma } from "../../lib/database";
import { errorSchema } from "../../shared/schemas/error-schema";
import { userSchema } from "../users/users.schema";
import { membershipSchema } from "./organization.schema";

export const getOrganizationMembersRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    "/organizations/:id/members",
    {
      schema: {
        tags: ["organizations"],
        summary: "Get organization members",
        description: "Get all members of an organization",
        operationId: "getOrganizationMembers",
        params: z.object({
          id: z.string().min(1, "Organization id cannot be empty"),
        }),
        response: {
          200: z.array(membershipSchema.extend({ user: userSchema })),
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const members = await prisma.membership.findMany({
        where: { organizationId: id },
        include: { user: true },
      });
      return res.status(200).send(members);
    }
  );
};
