import { z } from 'zod';

// validates req.body before it reaches Mongoose, mirroring the same rules as the User Mongoose schema
export const userInputSchema = z.strictObject({
  name: z.string().min(2, 'min length is 2 chars').max(255, 'max length is 255 chars'),
  email: z.email('must be a valid email address').min(5, 'min length is 5 chars'),
  password: z.string().min(8, 'min length is 8 chars'),
});

// NOTE: currently unused — the controller derives its own ReqBody type via z.input<typeof userInputSchema>
// instead (input, not infer/output, since nothing has a default/transform yet the two are equivalent).
// Kept exported for whichever future consumer needs the post-parse shape.
export type UserInput = z.infer<typeof userInputSchema>;

// PUT updates only the fields the client sends, so every key becomes optional
export const updateUserSchema = userInputSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// shapes what's sent back to the client — omits password so it never leaves the server (FR015)
export const userOutputSchema = z.object({
  id: z.string(),
  name: userInputSchema.shape.name,
  email: userInputSchema.shape.email,
});
