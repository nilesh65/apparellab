import z from "zod";
import { SIZE_OPTIONS } from "../models/products.model";

export const createOrderSchema = z.object({
  listingId: z.string().min(1),
  colorId: z.string().min(1),
  size: z.enum(SIZE_OPTIONS),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phoneNumber: z.string().min(1),
  }),
});

export type CreateOrderType = z.infer<typeof createOrderSchema>;
