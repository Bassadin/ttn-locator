import app from '@/app';
import request from 'supertest';

describe('Test devices routes', () => {
    test('Get all devices route', async () => {
        const res = await request(app).get('/devices/');
        expect(res.statusCode).toEqual(200);
        // check if data includes at least one device (loris-tracker-hfu)
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    device_id: 'loris-hfu-001',
                }),
            ]),
        );
    });

    test('Get TTNMapper API route with valid device id', async () => {
        const res = await request(app).get('/devices/ttnmapper_api/loris-tracker-hfu');
        expect(res.statusCode).toEqual(200);
    });
});
