import { z } from "zod";

export const createTripSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),

  destination: z
    .string()
    .min(2, "Destination is required")
    .max(100),

  description: z
    .string()
    .max(500, "Description too long")
    .optional(),

  coverImageUrl: z.string().url("Invalid cover image URL").optional(),

  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),

  visibility: z.enum(["PUBLIC", "PRIVATE"]),

  joinPolicy: z.enum(["OPEN", "APPROVAL"]),

  maxMembers: z
    .number()
    .int()
    .positive("Must be greater than 0")
    .max(1000)
    .optional(),

  categoryId: z.string().uuid().optional(),
  categoryName: z.string().min(1).max(60).optional(),

  tags: z.array(z.string()).optional(), // tag IDs or tag names
})
.refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const getPublicTripsFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string().uuid()).optional(),
});

export type GetPublicTripsFilterInput = z.infer<
  typeof getPublicTripsFilterSchema
>;

export const createTripPostSchema = z
  .object({
    body: z.string().min(1).max(500),
    imageUrl: z.string().url("Invalid image URL").optional(),
  })
  .refine((data) => data.body.trim().length > 0, {
    message: "Post body is required",
    path: ["body"],
  });

export type CreateTripPostInput = z.infer<typeof createTripPostSchema>;

export const inviteTripUserSchema = z.object({
  userId: z.string().uuid(),
});

export type InviteTripUserInput = z.infer<typeof inviteTripUserSchema>;
