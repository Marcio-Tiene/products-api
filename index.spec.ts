import { Server } from 'http';
import mongoose from 'mongoose';
import { agent, SuperAgentTest } from 'supertest';

import { server as app } from './index';

describe('First test', () => {
  let server: SuperAgentTest;
  let appProvider: Server;
  beforeAll(async () => {
    appProvider = await app;
    server = agent(appProvider);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    appProvider.close();
  });

  it('should return pong', async () => {
    const res = await server.get('/ping').expect(200);
    expect(res.body).toMatchObject({
      message: 'pong'
    });
  });
});
