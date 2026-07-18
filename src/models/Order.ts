import { Schema, model } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'productId is required'],
          },
          quantity: {
            type: Number,
            required: [true, 'quantity is required'],
            // not in FR014 explicitly, but a zero/negative quantity is never valid — DB-layer safety net
            min: [1, 'quantity must be at least 1'],
          },
        },
      ],
      // not in FR014 explicitly, but an order with zero products doesn't make sense — DB-layer safety net
      validate: [(products: unknown[]) => products.length > 0, 'order must contain at least one product'],
    },
    total: {
      type: Number,
      required: [true, 'total is required'],
    },
  },
  { timestamps: true },
);

export default model('Order', OrderSchema);
