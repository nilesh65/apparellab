import { z } from "zod"

export const createListingSchema = z.object({
  templateId: z.string().trim().min(1),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().default(""),
  sellingPrice: z.number().positive(),
  colorIds: z.array(z.string().trim().min(1)).min(1),
  artworkUrl: z.string().trim().min(1),
  artworkPlacement: z.object({
    top: z.number(),
    left: z.number(),
    width: z.number(),
    height: z.number(),
    refDisplayWidth: z.number(),
  }),
});

export const slugSchema = z.object({
  slug: z.string().min(1, "Slug is required")
})

export const GetMockupUrlSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  colorName: z.string().min(1, "Color Name is required")
})

export const generateArtworkSchema = z.object({
  prompt: z.string().min(1, "Prompt is required")
})

export type CreateListingType = z.infer<typeof createListingSchema>;
