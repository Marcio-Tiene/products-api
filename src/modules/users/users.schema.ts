import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import { UserDto } from './user.dto';

export interface UserDocument extends UserDto, Document {
  validatePassword: (password: string) => boolean;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, set: (v: string) => bcrypt.hashSync(String(v), 8) },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
  },
  {
    timestamps: true
  }
);

// eslint-disable-next-line func-names
UserSchema.methods.validatePassword = function (password: string) {
  console.log(this.password);
  const result = bcrypt.compareSync(password, this.password);
  return result;
};

export const UserModel = mongoose.model<UserDocument>('UserModel', UserSchema, 'users');
