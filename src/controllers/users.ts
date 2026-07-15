import type { RequestHandler } from 'express';
import type { z } from 'zod';
import User from '../models/User.ts';
import type { IdParams } from '../schemas/idParamSchema.ts';
import { type UpdateUserInput, type userInputSchema, userOutputSchema } from '../schemas/userSchema.ts';

//DTOs
// derived shape from zod's userInputSchema
type UserInputDTO = z.input<typeof userInputSchema>;
// derived shape from userOutputSchema — omits password, includes id
type UserOutputDTO = z.infer<typeof userOutputSchema>;

//  No try/catch. Instead centralized error handling with consistent error responses. Controllers don't format anything, they just throw.
// The actual errro formatting happens in errorHandler.ts


// NOTE: getUsers
// unknown = Params. GET /users has no :something in its URL, so there's nothing to type there. unknown is used
// UserOutputDTO[]  this says "this handler must respond with an array of UserOutputDTO objects."
// No throw here for an empty result. An empty list isn't an error — GET /users returning [] with 200
// is a valid, successful answer. Unlike getUserById, there's no specific resource being asked for that's "missing."
export const getUsers: RequestHandler<unknown, UserOutputDTO[]> = async (req, res) => {
  const users = await User.find();
  res.json(users.map((user) => userOutputSchema.parse(user)));
};

// getUserById
export const getUserById: RequestHandler<IdParams, UserOutputDTO> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json(userOutputSchema.parse(user));
};

// NOTE: createUser
export const createUser: RequestHandler<unknown, UserOutputDTO, UserInputDTO> = async (req, res) => {
  const { email } = req.body;

  // app-layer check for a friendly 409 instead of a raw E11000 from the DB's unique index (the actual guarantee)
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use', { cause: { status: 409 } });

  // satisfies is a TypeScript operator. It does one thing: it checks "does this value's type match/fit this other type?" 
  const user = await User.create(req.body satisfies UserInputDTO);
  res.status(201).json(userOutputSchema.parse(user));
};

// NOTE: updateUser
// updateUserSchema makes every field optional 'cause I wanna update whatever fields is sent rather than resend the entire user every time.
// I.e. If a client only wants to change their email, I don't want to force them to also resend name  for example.
export const updateUser: RequestHandler<IdParams, UserOutputDTO, UpdateUserInput> = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  if (update.email) {
    // exclude the current user so re-saving their own unchanged email doesn't fire  "Email already in use," 
    // _id: { $ne: id } means "match documents whose _id is not equal to this id
    const existingUser = await User.findOne({ email: update.email, _id: { $ne: id } });
    if (existingUser) throw new Error('Email already in use', { cause: { status: 409 } });
  }

  // { returnDocument: 'after' } --> by default, findByIdAndUpdate returns the document as it was before the update was applied.
  // returnDocument: 'after' tells it to return the document after the update instead.
  // So, I need that to avoid sending the client stale, pre-update data back
  const user = await User.findByIdAndUpdate(id, update, { returnDocument: 'after' });

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json(userOutputSchema.parse(user));
};


// NOTE: deleteUser
// { message: string } --> because RequestHandler has to describe what that specific handler actually sends back
// and deleteUser sends back something different in shape than the other handlers, it sends back message: 'User deleted' 
export const deleteUser: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json({ message: 'User deleted' });
};
