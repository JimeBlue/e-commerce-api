import { Router } from 'express';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '#controllers/products';
import validateBody from '#middleware/validateBody';
import validateParams from '#middleware/validateParams';
import validateQuery from '#middleware/validateQuery';
import { idParamSchema } from '#schemas/idParamSchema';
import { productInputSchema, productQuerySchema, updateProductSchema } from '#schemas/productSchema';

const productRoutes = Router();

productRoutes
  .route('/')
  .get(validateQuery(productQuerySchema), getProducts)
  .post(validateBody(productInputSchema), createProduct);

productRoutes
  .route('/:id')
  .all(validateParams(idParamSchema))
  .get(getProductById)
  .put(validateBody(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default productRoutes;
