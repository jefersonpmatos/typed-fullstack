import { z } from "zod";

// Campos reutilizáveis
const name = z.string().min(3).trim();
const email = z.string().email().min(1, "Email cannot be empty").trim();

export const updateUserSchema = z
  .object({
    name: name.optional(),
    email: email.optional(),
  })
  .refine(({ name, email }) => name || email, {
    message: "At least one (name or email) must be provided",
    path: ["name", "email"],
  });

export const userSchema = z.object({
  id: z.string(),
  name,
  email,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type UserSchema = z.infer<typeof userSchema>;
