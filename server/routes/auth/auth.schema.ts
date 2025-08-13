import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerUserSchema = z.object({
  name: z.string().min(3).trim(),
  email: z.string().email().min(1, "Email cannot be empty").trim(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginResponseSchema = z.object({ token: z.string() });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
