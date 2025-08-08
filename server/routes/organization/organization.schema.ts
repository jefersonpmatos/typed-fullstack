import { z } from "zod";

const id = z.string();
const timestamps = {
  createdAt: z.date(),
  updatedAt: z.date(),
};
const nameField = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

export const roleSchema = z.enum(["ADMIN", "MANAGER", "MEMBER"]);

export const membershipSchema = z.object({
  id,
  role: roleSchema,
  joinedAt: z.date(),
  userId: id,
  organizationId: id,
});

export const organizationSchema = z.object({
  id,
  name: nameField,
  ...timestamps,
});

export const createOrganizationSchema = z.object({
  name: nameField,
});

export const addOrRemoveMemberSchema = z.object({
  organizationId: id.min(1, "Organization ID is required"),
  userId: id.min(1, "User ID is required"),
});

export type Role = z.infer<typeof roleSchema>;
export type MemberShip = z.infer<typeof membershipSchema>;
export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type AddOrRemoveMemberSchema = z.infer<typeof addOrRemoveMemberSchema>;
