import app from 'src/app';
import request from 'supertest';

describe('Test devices routes', () => {
    test('Get all devices route', async () => {
        const res = await request(app).get('/devices/');
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
});
