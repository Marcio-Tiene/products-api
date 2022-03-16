import { ObjectId } from 'mongodb';

export class UserDto {
  _id!: ObjectId;

  name!: string;

  email!: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export type CreateuserDto = Omit<UserDto, '_id' | 'createdAt' | 'updatedAt'>;
