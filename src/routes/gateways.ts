import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// 📡 Gateways

// Get all gateways
router.get('/', async (request: Request, response: Response) => {
    const gateways = await prisma.gateway.findMany();
    response.send({ message: 'success', data: gateways });
});

// Get Device GPS Datapoints associated with a specific Gateway
router.get('/:id/gps_datapoints_with_rssi', async (request: Request, response: Response) => {
    const result = await prisma.gateway.findUnique({
        where: {
            gatewayId: request.params.id,
        },
        select: {
            ttnmapperDatapoints: {
                select: {
                    rssi: true,
                    snr: true,
                    deviceGPSDatapoint: true,
                },
            },
        },
    });

    if (!result) {
        response.status(404).send({ message: 'Gateway not found' });
        return;
    }

    // Get the deviceGPSDatapoint
    const deviceGPSDatapoints = result.ttnmapperDatapoints.map((ttnmapperDatapoint) => ({
        ...ttnmapperDatapoint.deviceGPSDatapoint,
        rssi: ttnmapperDatapoint.rssi,
        snr: ttnmapperDatapoint.snr,
    }));

    response.send({ message: 'success', data: deviceGPSDatapoints });
});

export default router;
