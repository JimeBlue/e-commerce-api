import { z } from 'zod';

export const categoryInputSchema = z.strictObject({
  name: z.string().min(1, 'name is required'),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const updateCategorySchema = categoryInputSchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categoryOutputSchema = z.object({
  id: z.string(),
  name: categoryInputSchema.shape.name,
});
