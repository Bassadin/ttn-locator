import app from '@/app';
import request from 'supertest';

describe('Test devices routes', () => {
    test('GET /devices/', async () => {
        const res = await request(app).get('/devices/');
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

    describe('POST /devices/', () => {
        test('Add device with valid ID', async () => {
            // May need to be adjusted later
            const validDeviceId = 'test_device';
            const res = await request(app).post('/devices/').send({
                deviceId: validDeviceId,
                subscription: false,
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('deviceId', validDeviceId);
            expect(res.body.data).toHaveProperty('subscription', false);
        });

        test('Try adding device with invalid ID', async () => {
            const invalidDeviceId = '';
            const res = await request(app).post('/devices/').send({
                deviceId: invalidDeviceId,
                subscription: false,
            });
            expect(res.statusCode).toEqual(400);
        });
    });
});
