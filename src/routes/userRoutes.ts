import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '#controllers/users';
import validateBody from '#middleware/validateBody';
import validateParams from '#middleware/validateParams';
import { idParamSchema } from '#schemas/idParamSchema';
import { updateUserSchema, userInputSchema } from '#schemas/userSchema';

const userRoutes = Router();

userRoutes.route('/').get(getUsers).post(validateBody(userInputSchema), createUser);

userRoutes
  .route('/:id')
  .all(validateParams(idParamSchema))
  .get(getUserById)
  .put(validateBody(updateUserSchema), updateUser)
  .delete(deleteUser);

export default userRoutes;
