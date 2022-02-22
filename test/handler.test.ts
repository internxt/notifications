import 'dotenv/config';
import request from 'supertest';
import getApp from '../src/http-server';
import type { Express } from 'express';

const validBody = { event: 'FILE_CREATED', payload: { id: 4, name: 'file' }, email: 'hello@internxt.com' };

describe('handler tests', () => {
  let app: Express;
  beforeAll(async () => {
    app = (await getApp()).app;
  });

  it('should return 401 if no auth is used', async () => {
    await request(app).post('/').send(validBody).expect(401);
  });

  it('should return 201 if body and auth are valid', async () => {
    await request(app).post('/').set({ 'X-API-KEY': process.env.API_KEY }).send(validBody).expect(201);
  });

  it('should return 400 if the auth is valid but the body isnt', async () => {
    await request(app).post('/').set({ 'X-API-KEY': process.env.API_KEY }).send({ lacks: 'fields' }).expect(400);
  });
});
