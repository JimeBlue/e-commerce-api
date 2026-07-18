import { Router } from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '#controllers/orders';
import validateBody from '#middleware/validateBody';
import validateParams from '#middleware/validateParams';
import { idParamSchema } from '#schemas/idParamSchema';
import { orderInputSchema, updateOrderSchema } from '#schemas/orderSchema';

const orderRoutes = Router();

orderRoutes.route('/').get(getOrders).post(validateBody(orderInputSchema), createOrder);

orderRoutes
  .route('/:id')
  .all(validateParams(idParamSchema))
  .get(getOrderById)
  .put(validateBody(updateOrderSchema), updateOrder)
  .delete(deleteOrder);

export default orderRoutes;
