import app from '@/app';
import request from 'supertest';
import { GPS_DATAPOINTS_ROUTE_NAME } from '@/routes/device_gps_datapoints';

describe('Test device_gps_datapoints routes', () => {
    test('Get all device_gps_datapoints route', async () => {
        const response = await request(app).get(`/${GPS_DATAPOINTS_ROUTE_NAME}/`);

        expect(response.statusCode).toEqual(200);
        // check if data array is at least 1 long
        expect(response.body.data.length).toBeGreaterThan(0);
    });
});
