import type { RequestHandler } from 'express';
import type { z } from 'zod';
import Order from '#models/Order';
import Product from '#models/Product';
import User from '#models/User';
import type { IdParams } from '#schemas/idParamSchema';
import { type OrderInput, orderOutputSchema, type UpdateOrderInput } from '#schemas/orderSchema';

type OrderOutputDTO = z.infer<typeof orderOutputSchema>;

// NOTE: Get all orders
export const getOrders: RequestHandler<unknown, OrderOutputDTO[]> = async (req, res) => {
  const orders = await Order.find();
  res.json(orders.map((order) => orderOutputSchema.parse(order)));
};

// NOTE: Get an order by id
export const getOrderById: RequestHandler<IdParams, OrderOutputDTO> = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  res.json(orderOutputSchema.parse(order));
};

// NOTE: Create an order
export const createOrder: RequestHandler<unknown, OrderOutputDTO, OrderInput> = async (req, res) => {
  const { userId, products } = req.body;

  // FR017: Create/Update Order must fail if userId does not reference an existing User
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found', { cause: { status: 400 } });

  // FR017: ...or if any productId does not reference an existing Product
  const productIds = products.map(({ productId }) => productId);
  const foundProducts = await Product.find({ _id: { $in: productIds } });
  if (foundProducts.length !== productIds.length) {
    throw new Error('One or more products not found', { cause: { status: 400 } });
  }

  // FR018: total is computed here from the products' current prices × quantities, not client-supplied
  const priceById = new Map(foundProducts.map((product) => [product.id, product.price]));
  const total = products.reduce((sum, { productId, quantity }) => sum + priceById.get(productId)! * quantity, 0);

  const order = await Order.create({ userId, products, total });
  res.status(201).json(orderOutputSchema.parse(order));
};

// NOTE: Update an order
export const updateOrder: RequestHandler<IdParams, OrderOutputDTO, UpdateOrderInput> = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  if (update.userId) {
    // FR017 applies on update too, but only if userId is one of the fields being changed
    const user = await User.findById(update.userId);
    if (!user) throw new Error('User not found', { cause: { status: 400 } });
  }

  let total: number | undefined;
  if (update.products) {
    // FR017 applies on update too, but only if products is one of the fields being changed
    const productIds = update.products.map(({ productId }) => productId);
    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length !== productIds.length) {
      throw new Error('One or more products not found', { cause: { status: 400 } });
    }

    // FR018: total is recomputed here whenever products changes, from current prices × quantities
    const priceById = new Map(foundProducts.map((product) => [product.id, product.price]));
    total = update.products.reduce((sum, { productId, quantity }) => sum + priceById.get(productId)! * quantity, 0);
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { ...update, ...(total !== undefined && { total }) },
    { returnDocument: 'after' },
  );

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  res.json(orderOutputSchema.parse(order));
};

// NOTE: Delete an order
export const deleteOrder: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  res.json({ message: 'Order deleted' });
};
