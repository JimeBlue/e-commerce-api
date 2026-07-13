import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [2, 'min length is 2 chars'],
    maxLength: [255, 'max length is 255 chars'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    minLength: [5, 'min length is 5 chars'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'min length is 8 chars'],
  },
});

export default model('User', UserSchema);
