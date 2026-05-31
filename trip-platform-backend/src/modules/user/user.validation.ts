import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots, and underscores")
    .optional(),
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url("Avatar URL must be valid").optional(),
});

export const getUserByUsernameSchema = z.object({
  username: z.string().min(1),
});

export const getUserByIdSchema = z.object({
  userId: z.string().uuid(),
});
