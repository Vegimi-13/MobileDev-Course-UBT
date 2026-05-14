import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(3).max(50).optional(),
});

export const getUserByUsernameSchema = z.object({
  username: z.string().min(1),
});

export const getUserByIdSchema = z.object({
  userId: z.string().uuid(),
});
