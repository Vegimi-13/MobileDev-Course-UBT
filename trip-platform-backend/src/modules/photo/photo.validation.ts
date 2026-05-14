import { z } from "zod";

export const createPhotoSchema = z.object({
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  caption: z.string().max(200).optional(),
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
