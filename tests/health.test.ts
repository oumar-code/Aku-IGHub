import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Check', () => {
  it('GET /api/v1/health should return healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.service).toBe('aku-ig-hub');
    expect(res.body.data.timestamp).toBeDefined();
  });

  it('GET / should return service info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('Aku IG Hub');
  });
});
