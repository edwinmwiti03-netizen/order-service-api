import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative()
});

export const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().nonnegative().optional()
});
