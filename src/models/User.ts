import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
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

export default mongoose.model<IUser>('User', UserSchema);
