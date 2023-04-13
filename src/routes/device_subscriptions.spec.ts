import app from '@/app';
import request from 'supertest';

describe('Test device_subscriptions routes', () => {
    test('Get all device_subscriptions route', async () => {
        const res = await request(app).get('/device_subscriptions/');
        expect(res.statusCode).toEqual(200);
        // check if data includes at least one device (loris-tracker-hfu)
        expect(res.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    device_id: 'loris-tracker-hfu',
                }),
            ]),
        );
    });

    test('Add a device_subscription route', async () => {
        const res = await request(app).post('/device_subscriptions/').send({
            device_id: 'loris-tracker-hfu',
        });
        expect(res.statusCode).toEqual(200);
    });

    test('Test add device_subscription route without valid parameter', async () => {
        const res = await request(app).post('/device_subscriptions/').send({});
        expect(res.statusCode).toEqual(500);
    });
});
