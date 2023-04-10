import app from 'app';
import request from 'supertest';

describe('Test base routes', () => {
    test('Catch-all route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });
});
