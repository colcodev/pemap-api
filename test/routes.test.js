import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../src';
import { closeRedisClient } from '../src/helpers/redis';

dotenv.config({ path: '.env.test' });

let appToken = null;
let userToken = null;

afterAll(async () => {
  await app.server.close();
  await mongoose.connection.close();
});

describe('Get an app token', () => {
  it('should return an app token when request GET /tokens/app', async () => {
    const res = await request(app).get('/v1/tokens/app');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('access_token');
    appToken = res.body.access_token;
  });
});

describe('Get a user token', () => {
  it('should respond with a 400 when request GET /tokens/user without Authentication header', async () => {
    const res = await request(app).get('/v1/tokens/user');
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 400 when request GET /tokens/user without userName/password params', async () => {
    const res = await request(app).get('/v1/tokens/user').set('Authorization', appToken);
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 401 when request GET /tokens/user with a bad userName/password combination', async () => {
    const res = await request(app).get('/v1/tokens/user').set('Authorization', appToken).query({
      userName: 'bad.email.test@gmail.com',
      password: 'badPassword',
    });
    expect(res.statusCode).toEqual(401);
  });

  it('should respond with a 200 when request GET /tokens/user with userName/password params', async () => {
    const res = await request(app).get('/v1/tokens/user').set('Authorization', appToken).query({
      userName: process.env.PEYA_USERNAME,
      password: process.env.PEYA_PASSWORD,
    });
    expect(res.statusCode).toEqual(200);
    userToken = res.body.access_token;
  });
});

describe('Get user info', () => {
  it('should respond with a 400 when request GET /myAccount without Authentication header', async () => {
    const res = await request(app).get('/v1/myAccount');
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 200 when request GET /myAccount', async () => {
    const res = await request(app).get('/v1/myAccount').set('Authorization', userToken);
    expect(res.statusCode).toEqual(200);
  });
});

describe('Get restaurants', () => {
  afterEach(() => {
    closeRedisClient();
  });

  it('should respond with a 400 when request GET /search/restaurants without Authentication header', async () => {
    const res = await request(app).get('/v1/search/restaurants');
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 400 when request GET /search/restaurants without country and point params', async () => {
    const res = await request(app).get('/v1/search/restaurants').set('Authorization', userToken);
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 200 when request GET /search/restaurants', async () => {
    const res = await request(app)
      .get('/v1/search/restaurants')
      .set('Authorization', userToken)
      .query({
        country: 1,
        point: '-34.9209098815918,-56.150474548339844',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('Get admin stats', () => {
  it('should respond with a 400 when request GET /admin/stats without Authentication header', async () => {
    const res = await request(app).get('/v1/admin/stats');
    expect(res.statusCode).toEqual(400);
  });

  it('should respond with a 200 when request GET /admin/stats', async () => {
    const res = await request(app).get('/v1/admin/stats').set('Authorization', userToken);
    expect(res.statusCode).toEqual(200);
  });
});
