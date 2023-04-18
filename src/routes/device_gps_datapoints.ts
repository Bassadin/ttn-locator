import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📍 Device GPS datapoints

// Get all device GPS datapoints
router.get('/', async (request: Request, response: Response) => {
    const minTTNMapperDatapoints = request.query.min_ttnmapper_datapoints;

    let deviceGPSDatapoints;

    if (minTTNMapperDatapoints) {
        // TODO use prisma client instead of raw query as soon as possible
        deviceGPSDatapoints = await prisma.$queryRaw`
            SELECT *
            FROM "DeviceGPSDatapoint"
            WHERE (
                SELECT COUNT(*)
                FROM "TtnMapperDatapoint"
                WHERE "DeviceGPSDatapoint".id = "TtnMapperDatapoint"."deviceGPSDatapointId"
            ) >= 3
        `;
    } else {
        deviceGPSDatapoints = await prisma.deviceGPSDatapoint.findMany();
    }

    response.send({
        data: deviceGPSDatapoints,
    });
});

// Get all ttnmapper datapoints for a device GPS datapoint
router.get('/:id/ttnmapper_datapoints', async (request: Request, response: Response) => {
    const ttnMapperDatapoints = await prisma.deviceGPSDatapoint
        .findUnique({
            where: {
                id: Number(request.params.id),
            },
        })
        .ttnMapperDatapoints();
    response.send({
        data: ttnMapperDatapoints,
    });
});

export default router;
