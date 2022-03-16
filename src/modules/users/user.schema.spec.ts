import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { UserModel } from './users.schema';

describe('User schema test', () => {
  let mongodb: MongoMemoryServer;

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    await mongoose.connect(mongodb.getUri(), { dbName: 'user-schema-db' });
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it('Should create a user', async () => {
    const body = { name: 'TEste', email: 'test@email.com', password: '123' };
    const newUser = new UserModel(body);
    const user = await newUser.save();

    expect(user.name).toBe(body.name);
    expect(user.email).toBe(body.email);

    expect(user.validatePassword(body.password)).toBe(true);
  });

  it('Should not create a user', async () => {
    let body: any = { email: 'test@email.com', password: '123' };
    let newUser = new UserModel(body);
    await newUser.save().catch((err: any) => {
      expect(err.message).toBe('UserModel validation failed: name: Path `name` is required.');
    });

    body = { name: 'TEste', password: '123' };
    newUser = new UserModel(body);
    await newUser.save().catch((err: any) => {
      expect(err.message).toBe('UserModel validation failed: email: Path `email` is required.');
    });

    body = { email: 'test@email.com', name: 'TEste' };
    newUser = new UserModel(body);
    await newUser.save().catch((err: any) => {
      expect(err.message).toBe('UserModel validation failed: password: Path `password` is required.');
    });

    body = { name: 'TEste' };
    newUser = new UserModel(body);
    await newUser.save().catch((err: any) => {
      expect(err.message).toBe(
        'UserModel validation failed: password: Path `password` is required., email: Path `email` is required.'
      );
    });
  });
  it('Should hash a password correctly', async () => {
    const body = { name: 'TEste', email: 'test@email.com', password: '123' };
    const newUser = new UserModel(body);
    const user = await newUser.save();

    const verifyhash = await bcrypt.compare(body.password, user.password);

    expect(verifyhash).toBe(true);
  });
});
