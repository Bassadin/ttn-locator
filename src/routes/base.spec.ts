import app from '@/app';
import request from 'supertest';

describe('Test base routes', () => {
    test('Catch-all route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });

    test('Non-existing route', async () => {
        const res = await request(app).get('/non-existing-route-aaaaaaaaaaa');
        expect(res.statusCode).toEqual(404);
    });

    test('Healthcheck route', async () => {
        const res = await request(app).get('/healthcheck');
        expect(res.statusCode).toEqual(200);
    });
});
