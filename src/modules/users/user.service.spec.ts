/* eslint-disable no-throw-literal */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { UserModel } from './users.schema';

const TEST_TOKEN = '321asd2as654ea2s1d6as54ea32s1e';

describe('User service', () => {
  let mongodb: MongoMemoryServer;
  let userService: InstanceType<typeof UserService>;
  const originalJwtSign = jwt.sign;

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri(), { dbName: 'user-service-db' });
    userService = new UserService(UserModel);
    jwt.sign = jest.fn((payload, secret) => TEST_TOKEN);
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
    jwt.sign = originalJwtSign;
  });

  it('Should create a user', async () => {
    const body = { name: 'TEste', email: 'test@email.com', password: '123' };
    const createdResponse = await userService.createUser(body);
    expect(createdResponse).toMatchObject({ status: 201, message: 'created successful' });
  });

  it('Should authenticate a user', async () => {
    const body = { name: 'TEste', email: 'test@email.com', password: '123' };
    const createdResponse = await userService.createUser(body);
    expect(createdResponse).toMatchObject({ status: 201, message: 'created successful' });

    const { name, ...loginBody } = body;

    const authResponse = await userService.authenticateUser(loginBody);
    expect(authResponse).toMatchObject({ status: 200, message: 'authenticated', token: TEST_TOKEN });
  });

  it('should not authenticate user with incorrect password', async () => {
    const body = { name: 'TEste', email: 'test@email.com', password: '123' };
    const createdResponse = await userService.createUser(body);

    expect(createdResponse).toMatchObject({ status: 201, message: 'created successful' });

    const { email } = body;

    const authResponse = await userService.authenticateUser({ email, password: '12345' });
    expect(authResponse).toMatchObject({ status: 403, message: 'email or password is incorrect' });
  });

  it('should not authenticate user with incorrect email', async () => {
    const body = { email: 'test@email.com', password: '123' };

    const authResponse = await userService.authenticateUser(body);
    expect(authResponse).toMatchObject({ status: 403, message: 'email or password is incorrect' });
  });
  it('should not authenticate user with blank email or password', async () => {
    let body: any = { email: '', password: '123' };

    let authResponse = await userService.authenticateUser(body);

    expect(authResponse).toMatchObject({ status: 403, message: 'email and/or password is missing' });

    body = { email: 'test@testando', password: '' };

    authResponse = await userService.authenticateUser(body);

    expect(authResponse).toMatchObject({ status: 403, message: 'email and/or password is missing' });
  });
  it('Should handle unexpected error', async () => {
    const body = { email: 'test@email.com', password: '123' };
    const createBody = { name: 'TEste', email: 'test@email.com', password: '123' };
    await userService.createUser(createBody);
    jwt.sign = jest.fn(() => {
      throw { statusCode: 500, message: 'unexpected error handled' };
    });
    let createdResponse = await userService.authenticateUser(body);

    expect(createdResponse).toMatchObject({ status: 500, message: 'unexpected error handled' });
    jwt.sign = jest.fn(() => {
      throw { status: 500, msg: 'unexpected error handled' };
    });

    createdResponse = await userService.authenticateUser(body);

    expect(createdResponse).toMatchObject({ status: 500, message: 'unexpected error handled' });
  });
});
