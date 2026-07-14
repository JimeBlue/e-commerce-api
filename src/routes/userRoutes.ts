import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/users.ts';
import validateBody from '../middleware/validateBody.ts';
import validateParams from '../middleware/validateParams.ts';
import { idParamSchema } from '../schemas/idParamSchema.ts';
import { updateUserSchema, userInputSchema } from '../schemas/userSchema.ts';

const userRoutes = Router();

userRoutes.route('/').get(getUsers).post(validateBody(userInputSchema), createUser);

userRoutes
  .route('/:id')
  .all(validateParams(idParamSchema))
  .get(getUserById)
  .put(validateBody(updateUserSchema), updateUser)
  .delete(deleteUser);

export default userRoutes;
