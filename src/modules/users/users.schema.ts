import mongoose from 'mongoose';

import { UserDto } from './user.dto';

export type UserDocument = mongoose.Document & UserDto;

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
  },
  { timestamps: { createdAt: 'creationDate', updatedAt: 'lastChange' } }
);

export const UserModel = mongoose.model<UserDocument>('UserModel', UserSchema, 'users');
