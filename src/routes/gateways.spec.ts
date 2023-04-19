import app from '@/app';
import request from 'supertest';

describe('Test device_gps_datapoints routes', () => {
    test('Get all device_gps_datapoints', async () => {
        const response = await request(app).get('/device_gps_datapoints');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('Get gps_datapoints_with_rssi for specific gateway', async () => {
        const response = await request(app).get('/gateways/testing-gateway-prisma-001/gps_datapoints_with_rssi');
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('Get gps_datapoints_with_rssi for invalid gateway id', async () => {
        const response = await request(app).get('/gateways/invalid-id-kekekeke/gps_datapoints_with_rssi');
        expect(response.statusCode).toBe(404);
    });
});
