import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [2, 'min length is 2 chars'],
    maxLength: [255, 'max length is 255 chars'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
    maxLength: [2000, 'max length is 2000 chars'],
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    // not in FR013 explicitly, but a negative price is never valid — enforced here as a DB-layer safety net
    min: [0, 'price cannot be negative'],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'categoryId is required'],
  },
});

export default model('Product', ProductSchema);
