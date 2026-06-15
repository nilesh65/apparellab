import { z } from "zod"

export const productIdSchema = z.object({
  id: z.string().min(1, "Product Id is required")
})
