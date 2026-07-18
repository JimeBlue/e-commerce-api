import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '#controllers/categories';
import validateBody from '#middleware/validateBody';
import validateParams from '#middleware/validateParams';
import { categoryInputSchema, updateCategorySchema } from '#schemas/categorySchema';
import { idParamSchema } from '#schemas/idParamSchema';

const categoryRoutes = Router();

categoryRoutes.route('/').get(getCategories).post(validateBody(categoryInputSchema), createCategory);

categoryRoutes
  .route('/:id')
  .all(validateParams(idParamSchema))
  .get(getCategoryById)
  .put(validateBody(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default categoryRoutes;
