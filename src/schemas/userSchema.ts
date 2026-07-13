import { z } from 'zod';

// validates req.body before it reaches Mongoose, mirroring the same rules as the User Mongoose schema
export const userSchema = z.strictObject({
  name: z.string().min(2, 'min length is 2 chars').max(255, 'max length is 255 chars'),
  email: z.email('must be a valid email address').min(5, 'min length is 5 chars'),
  password: z.string().min(8, 'min length is 8 chars'),
});

export type UserInput = z.infer<typeof userSchema>;
