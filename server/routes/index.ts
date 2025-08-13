import { FastifyInstance } from "fastify";

import { authRoutes } from "./auth";
import { addOrganizationMemberRoute } from "./organization/add-organization-member";
import { createOrganizationRoute } from "./organization/create-organization";
import { deleteOrganizationRoute } from "./organization/delete-organization";
import { getAllOrganizationsRoute } from "./organization/get-all-organizations";
import { getOrganizationRoute } from "./organization/get-organization";
import { getOrganizationMembersRoute } from "./organization/get-organization-members";
import { removeOrganizationMemberRoute } from "./organization/remove-organization-member";
import { updateMemberRoleInOrganizationRoute } from "./organization/update-member-role-in-organization";
import { updateOrganizationRoute } from "./organization/update-organization";
import { usersRoutes } from "./users";

export const routes = async (app: FastifyInstance) => {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(usersRoutes, { prefix: "/users" });

  await app.register(createOrganizationRoute);
  await app.register(updateOrganizationRoute);
  await app.register(getOrganizationRoute);
  await app.register(getAllOrganizationsRoute);
  await app.register(deleteOrganizationRoute);
  await app.register(addOrganizationMemberRoute);
  await app.register(getOrganizationMembersRoute);
  await app.register(removeOrganizationMemberRoute);
  await app.register(updateMemberRoleInOrganizationRoute);

  app.get("/health", async (_, res) =>
    res.send({ message: "Server is healthy" })
  );
};
