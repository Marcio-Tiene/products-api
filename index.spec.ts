import { agent, SuperAgentTest } from 'supertest';

import { server as app } from './index';

describe('First test', () => {
  let server: SuperAgentTest;
  beforeAll(() => {
    server = agent(app);
  });
  afterAll(() => {
    app.close();
  });

  it('should return pong', async () => {
    const res = await server.get('/ping').expect(200);
    expect(res.body).toMatchObject({
      message: 'pong'
    });
  });
});
