import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const GPS_DATAPOINTS_ROUTE_NAME = 'device_gps_datapoints';

export const deviceGpsDatapointsRoutes = express.Router();
const prisma = new PrismaClient();

// Get all device GPS datapoints
deviceGpsDatapointsRoutes.get('/', async (request: Request, response: Response) => {
    const deviceGPSDatapoints = await prisma.deviceGPSDatapoint.findMany();
    response.send({
        data: deviceGPSDatapoints,
    });
});
