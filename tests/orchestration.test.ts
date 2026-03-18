import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();
const API_KEY = 'dev-api-key';

describe('Orchestration API', () => {
  let workflowId: string;

  it('POST /api/v1/orchestration/workflows should create a workflow', async () => {
    const res = await request(app)
      .post('/api/v1/orchestration/workflows')
      .set('x-api-key', API_KEY)
      .send({
        name: 'Test Workflow',
        description: 'A test workflow',
        steps: [
          {
            id: 'step-1',
            name: 'Step 1',
            integrationId: 'int-1',
            method: 'GET',
            path: '/users',
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Workflow');
    workflowId = res.body.data.id;
  });

  it('GET /api/v1/orchestration/workflows should list workflows', async () => {
    const res = await request(app)
      .get('/api/v1/orchestration/workflows')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/orchestration/workflows/:id should return workflow', async () => {
    const res = await request(app)
      .get(`/api/v1/orchestration/workflows/${workflowId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(workflowId);
  });

  it('POST /api/v1/orchestration/workflows should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/orchestration/workflows')
      .set('x-api-key', API_KEY)
      .send({ name: 'No steps' });
    expect(res.status).toBe(400);
  });

  it('DELETE /api/v1/orchestration/workflows/:id should delete workflow', async () => {
    const res = await request(app)
      .delete(`/api/v1/orchestration/workflows/${workflowId}`)
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(200);
  });

  it('GET /api/v1/orchestration/workflows/:id should return 404 for missing workflow', async () => {
    const res = await request(app)
      .get('/api/v1/orchestration/workflows/nonexistent')
      .set('x-api-key', API_KEY);
    expect(res.status).toBe(404);
  });
});
