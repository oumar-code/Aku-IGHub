const request = require('supertest');
const app = require('../src/index');

describe('GET /', () => {
  it('should return service running message', async () => {
    const res = await request(app).get('/');
    expect(res.text).toBe('IG Hub service is running!');
  });
});