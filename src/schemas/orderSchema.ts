import { isValidObjectId, Types } from 'mongoose';
import { z } from 'zod';

const orderProductInputSchema = z.strictObject({
  productId: z.string().refine(isValidObjectId, 'must be a valid id'),
  quantity: z.number().min(1, 'quantity must be at least 1'),
});

// FR018: total is computed server-side from current product prices × quantities,
// so it is not part of the input schema — clients cannot set it directly
export const orderInputSchema = z.strictObject({
  userId: z.string().refine(isValidObjectId, 'must be a valid id'),
  products: z.array(orderProductInputSchema).min(1, 'order must contain at least one product'),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export const updateOrderSchema = orderInputSchema.partial();
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// a raw Mongoose document's ObjectId fields (userId, productId) come back as ObjectId
// instances, not strings — same issue as Product's categoryId, same fix
const objectIdToString = z.union([z.string(), z.instanceof(Types.ObjectId)]).transform(String);

const orderProductOutputSchema = z.object({
  productId: objectIdToString,
  quantity: z.number(),
});

export const orderOutputSchema = z.object({
  id: z.string(),
  userId: objectIdToString,
  products: z.array(orderProductOutputSchema),
  total: z.number(),
  // createdAt/updatedAt exposed here: useful order history info, and FR015 doesn't say to exclude them
  createdAt: z.date(),
  updatedAt: z.date(),
});
