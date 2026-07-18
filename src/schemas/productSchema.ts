import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const productInputSchema = z.strictObject({
  name: z.string().min(2, 'min length is 2 chars').max(255, 'max length is 255 chars'),
  description: z.string().max(2000, 'max length is 2000 chars'),
  price: z.number().min(0, 'price cannot be negative'),
  categoryId: z.string().refine(isValidObjectId, 'must be a valid id'),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const updateProductSchema = productInputSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productOutputSchema = z.object({
  id: z.string(),
  name: productInputSchema.shape.name,
  description: productInputSchema.shape.description,
  price: productInputSchema.shape.price,
  categoryId: productInputSchema.shape.categoryId,
});
