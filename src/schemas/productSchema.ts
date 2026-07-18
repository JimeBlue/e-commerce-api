import { isValidObjectId, Types } from 'mongoose';
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
  // a raw Mongoose document's categoryId is an ObjectId instance, not a string — the input schema's
  // plain z.string() shape can't be reused here, so this coerces it to a string for the API response
  categoryId: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform(String),
});

// FR020: GET /products supports an optional ?categoryId= filter — validated here since it needs
// the same isValidObjectId check as the body field, just applied to a query string instead
export const productQuerySchema = z.object({
  categoryId: z.string().refine(isValidObjectId, 'must be a valid id').optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
