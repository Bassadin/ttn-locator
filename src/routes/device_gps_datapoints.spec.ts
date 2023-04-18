import app from '@/app';
import request from 'supertest';

describe('Test device_gps_datapoints routes', () => {
    test('Get all device_gps_datapoints route', async () => {
        const response = await request(app).get(`/device_gps_datapoints/`);

        expect(response.statusCode).toEqual(200);
        // check if data array is at least 1 long
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});
