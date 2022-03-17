import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getMockReq, getMockRes } from '@jest-mock/express';

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserModel } from './users.schema';
import { UserController } from './user.controller';
import { CreateUserDto, LoginUserDto } from './user.dto';

const TEST_TOKEN = '321asd2as654ea2s1d6as54ea32s1e';
interface IFakeReqCreate {
  body: CreateUserDto;
}

describe('User Controller Test', () => {
  let mongodb: MongoMemoryServer;
  let userService: InstanceType<typeof UserService>;
  let userController: InstanceType<typeof UserController>;
  const originalJwtSign = jwt.sign;

  class FakeRes {
    statusCode!: number;

    body: Record<any, any> = {};

    public status = (n: number) => {
      this.statusCode = n;
      return this;
    };

    public send = (body: Record<any, any>) => {
      this.body = body;
      return this;
    };

    public json = (body: Record<any, any>) => {
      this.body = body;
      return this;
    };
  }

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri(), { dbName: 'user-controller-db' });
    userService = new UserService(UserModel);
    userController = new UserController(userService);
    jwt.sign = jest.fn(() => TEST_TOKEN);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
    jwt.sign = originalJwtSign;
  });

  it('should create a user', async () => {
    const { res } = getMockRes();

    const body: CreateUserDto = {
      name: 'marcio',
      email: 'test@zé.com',
      password: '123'
    };

    const req = getMockReq({ body });

    const response = await userController.create(req, res);

    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'created successful' }));
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it('should not create a user', async () => {
    const { res, mockClear } = getMockRes();

    let body: Partial<CreateUserDto> = {
      email: 'test@zé.com',
      password: '123'
    };

    let req = getMockReq({ body });

    let response = await userController.create(req, res);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'UserModel validation failed: name: Path `name` is required.' })
    );
    expect(response.status).toHaveBeenCalledWith(400);
    mockClear();
    body = {
      email: 'test@zé.com'
    };

    req = getMockReq({ body });
    response = await userController.create(req, res);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'UserModel validation failed: password: Path `password` is required., name: Path `name` is required.'
      })
    );
    expect(response.status).toHaveBeenCalledWith(400);
    mockClear();

    body = {
      email: ''
    };

    req = getMockReq({ body });
    response = await userController.create(req, res);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "The email field(s) can't be nullish" })
    );
    expect(response.status).toHaveBeenCalledWith(400);
    mockClear();
  });
  it('Should authenticate user and return a jwt', async () => {
    const { res, clearMockRes } = getMockRes();

    const body: CreateUserDto = {
      name: 'marcio',
      email: 'test@zé.com',
      password: '123'
    };

    let req = getMockReq({ body });

    await userController.create(req, res);

    clearMockRes();

    const { name, ...loginBody } = body;
    req = getMockReq({ body: loginBody });

    const response = await userController.authenticate(req, res);

    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ token: TEST_TOKEN }));
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it('should not authenticate user with incorrect email', async () => {
    const { res } = getMockRes();
    const body = { email: 'test@email.com', password: '123' };

    const req = getMockReq({ body });

    const response = await userController.authenticate(req, res);

    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'email or password is incorrect' }));
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it('should not authenticate user with incorrect password', async () => {
    const { res, clearMockRes } = getMockRes();

    let body: any = {
      name: 'marcio',
      email: 'test@zé.com',
      password: '123'
    };

    let req = getMockReq({ body });

    await userController.create(req, res);

    clearMockRes();
    body = { email: 'test@zé.com', password: '1234' };

    req = getMockReq({ body });

    const response = await userController.authenticate(req, res);

    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'email or password is incorrect' }));
    expect(response.status).toHaveBeenCalledWith(403);

    clearMockRes();
  });

  it('should not authenticate user with blank email or password', async () => {
    const { res, clearMockRes } = getMockRes();

    let body: any = {
      name: 'marcio',
      email: 'test@zé.com',
      password: '123'
    };

    let req = getMockReq({ body });

    await userController.create(req, res);

    clearMockRes();
    body = { email: '', password: '123' };

    req = getMockReq({ body });

    let response = await userController.authenticate(req, res);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email and/or password is missing' })
    );
    expect(response.status).toHaveBeenCalledWith(403);

    clearMockRes();

    body = { email: 'test@zé.com', password: '' };

    req = getMockReq({ body });

    response = await userController.authenticate(req, res);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'email and/or password is missing' })
    );
    expect(response.status).toHaveBeenCalledWith(403);
  });
});
