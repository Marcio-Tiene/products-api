import { ObjectId } from 'mongodb';

export class UserDto {
  _id!: ObjectId | string;

  name!: string;

  email!: string;

  createdAt!: Date;

  updatedAt!: Date;

  password!: string;
}

export type CreateUserDto = Omit<UserDto, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export type LoginUserDto = Omit<CreateUserDto, 'name'>;
