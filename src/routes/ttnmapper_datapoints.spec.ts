import app from 'src/app';
import request from 'supertest';

describe('Test ttnmapper_datapoints routes', () => {
    test('Get all ttnmapper_datapoints route', async () => {
        const res = await request(app).get('/ttnmapper_datapoints/');
        expect(res.statusCode).toEqual(200);
    });
});
