import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
const API_KEY = 'dev-api-key';

describe('Integration API', () => {
  let integrationId: string;

  it('POST /api/v1/integrations should create an integration', async () => {
    const res = await request(app)
      .post('/api/v1/integrations')
      .set('x-api-key', API_KEY)
      .send({ name: 'Test Service', type: 'http', baseUrl: 'https://api.example.com' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Service');
    expect(res.body.data.id).toBeDefined();
    integrationId = res.body.data.id;
  });

  it('GET /api/v1/integrations should list integrations', async () => {
    const res = await request(app)
      .get('/api/v1/integrations')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/integrations/:id should return integration', async () => {
    const res = await request(app)
      .get(`/api/v1/integrations/${integrationId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(integrationId);
  });

  it('PUT /api/v1/integrations/:id should update integration and change updatedAt', async () => {
    const before = await request(app)
      .get(`/api/v1/integrations/${integrationId}`)
      .set('x-api-key', API_KEY);
    const res = await request(app)
      .put(`/api/v1/integrations/${integrationId}`)
      .set('x-api-key', API_KEY)
      .send({ name: 'Updated Service' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Service');
    expect(res.body.data.createdAt).toBe(before.body.data.createdAt);
    expect(res.body.data.updatedAt).not.toBe(before.body.data.updatedAt);
  });

  it('DELETE /api/v1/integrations/:id should delete integration', async () => {
    const res = await request(app)
      .delete(`/api/v1/integrations/${integrationId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/integrations/:id should return 404 for missing integration', async () => {
    const res = await request(app)
      .get('/api/v1/integrations/nonexistent')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(404);
  });

  it('POST /api/v1/integrations should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/integrations')
      .set('x-api-key', API_KEY)
      .send({ name: 'Incomplete' });
    expect(res.status).toBe(400);
  });

  it('should return 401 without API key', async () => {
    const res = await request(app).get('/api/v1/integrations');
    expect(res.status).toBe(401);
  });
});
