import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
const API_KEY = 'dev-api-key';

describe('Gateway API', () => {
  let routeId: string;

  it('POST /api/v1/gateway/routes should create a route', async () => {
    const res = await request(app)
      .post('/api/v1/gateway/routes')
      .set('x-api-key', API_KEY)
      .send({
        name: 'Users Route',
        matchPath: '/users',
        targetUrl: 'https://jsonplaceholder.typicode.com',
        methods: ['GET'],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Users Route');
    routeId = res.body.data.id;
  });

  it('GET /api/v1/gateway/routes should list routes', async () => {
    const res = await request(app)
      .get('/api/v1/gateway/routes')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/gateway/routes/:id should return route', async () => {
    const res = await request(app)
      .get(`/api/v1/gateway/routes/${routeId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(routeId);
  });

  it('POST /api/v1/gateway/routes should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/gateway/routes')
      .set('x-api-key', API_KEY)
      .send({ name: 'Incomplete' });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/v1/gateway/routes/:id should delete route', async () => {
    const res = await request(app)
      .delete(`/api/v1/gateway/routes/${routeId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/gateway/routes/:id should return 404 for missing route', async () => {
    const res = await request(app)
      .get('/api/v1/gateway/routes/nonexistent')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(404);
  });
});
