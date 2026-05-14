import { z } from "zod";

export const createCloudinarySignatureSchema = z.object({
  folder: z.string().min(1).optional(),
});

export type CreateCloudinarySignatureInput = z.infer<
  typeof createCloudinarySignatureSchema
>;
