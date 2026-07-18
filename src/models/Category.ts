import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
});

export default model('Category', CategorySchema);
