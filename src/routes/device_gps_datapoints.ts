import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '@/middleware/logger';

const router = express.Router();
const prisma = new PrismaClient();

// 📍 Device GPS datapoints

// Get all device GPS datapoints
router.get('/', async (request: Request, response: Response) => {
    const minTTNMapperDatapoints: number = parseInt(<string>request.query.min_ttnmapper_datapoints) || 0;
    const maxHDOP: number = parseFloat(<string>request.query.max_hdop) || 10;

    logger.info(
        `Getting all device GPS datapoints with at least ${minTTNMapperDatapoints} TTNMapper datapoints and HDOP <= ${maxHDOP}`,
    );

    // TODO use prisma client instead of raw query as soon as possible
    const deviceGPSDatapoints = await prisma.$queryRaw`
            SELECT *
            FROM "DeviceGPSDatapoint"
            WHERE (
                SELECT COUNT(*)
                FROM "TtnMapperDatapoint"
                WHERE "DeviceGPSDatapoint".id = "TtnMapperDatapoint"."deviceGPSDatapointId"
            ) >= ${minTTNMapperDatapoints}
                AND "DeviceGPSDatapoint".hdop <= ${maxHDOP};
        `;

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
