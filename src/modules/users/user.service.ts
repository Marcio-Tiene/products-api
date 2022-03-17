/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import { IServiceResponse } from '../../interfaces/service-responses';
import { generalErrorHandler } from '../../util/general-error-handler';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserModel } from './users.schema';

export class UserService {
  protected Entity: typeof UserModel;

  constructor(model: typeof UserModel) {
    this.Entity = model;
  }

  createUser = async (payload: CreateUserDto): Promise<IServiceResponse> => {
    try {
      const nullFields = Object.keys(payload).reduce((messages: string[], value: string) => {
        const { [value as keyof CreateUserDto]: newvalue } = payload;
        if (newvalue === '') {
          messages.push(value);
        }
        return messages;
      }, []);

      if (nullFields.length) {
        return { status: 400, message: `The ${nullFields.join(', ')} field(s) can't be nullish` };
      }
      const user = new this.Entity(payload);

      await user.save();

      return { status: 201, message: 'created successful' };
    } catch (err) {
      return generalErrorHandler(err);
    }
  };

  authenticateUser = async (payload: LoginUserDto): Promise<IServiceResponse> => {
    try {
      const { email, password } = payload;

      if (!email || !password) {
        return { status: 403, message: `email and/or password is missing` };
      }

      const user = await this.Entity.findOne({ email });

      if (!user) {
        return { status: 403, message: `email or password is incorrect` };
      }

      const isValidPassWord = user.validatePassword(password);

      if (!isValidPassWord) {
        return { status: 403, message: `email or password is incorrect` };
      }

      const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET || 'your_secret', { expiresIn: '7d' });

      return { status: 200, message: 'authenticated', token };
    } catch (err: any) {
      return generalErrorHandler(err);
    }
  };
}
