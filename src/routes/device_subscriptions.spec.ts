import app from '@/app';
import request from 'supertest';

describe('Test device_subscriptions routes', () => {
    test('Get all device_subscriptions route', async () => {
        const res = await request(app).get('/device_subscriptions/');
        expect(res.statusCode).toEqual(200);
        // check if data includes at least one Device (loris-tracker-hfu)
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    deviceId: 'loris-hfu-001',
                }),
            ]),
        );
    });

    test('Add a DeviceSubscription route', async () => {
        const res = await request(app).post('/device_subscriptions/').send({
            deviceId: 'loris-hfu-001',
        });
        expect(res.statusCode).toEqual(200);
    });

    test('Test add DeviceSubscription route without valid parameter', async () => {
        const res = await request(app).post('/device_subscriptions/').send({});
        expect(res.statusCode).toEqual(500);
    });
});
