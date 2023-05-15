import prisma from '@/global/prisma';
import express, { Request, Response } from 'express';

const router = express.Router();

// 📡 Gateways

// Get all gateways with count of associated GPS datapoints
router.get('/', async (request: Request, response: Response) => {
    const gateways = await prisma.gateway.findMany({
        include: {
            _count: {
                select: { ttnmapperDatapoints: true },
            },
        },
    });
    response.send({ message: 'success', data: gateways });
});

// Get single gateway data with count of associated GPS datapoints
router.get('/:id', async (request: Request, response: Response) => {
    const gateway = await prisma.gateway.findUnique({
        where: {
            gatewayId: request.params.id,
        },
        include: {
            _count: {
                select: { ttnmapperDatapoints: true },
            },
        },
    });

    if (!gateway) {
        response.status(404).send({ message: 'Gateway not found' });
        return;
    }

    response.send({ message: 'success', data: gateway });
});

// Get Device GPS Datapoints associated with a specific Gateway
router.get('/:id/gps_datapoints_with_rssi', async (request: Request, response: Response) => {
    const hdopFilter = request.query.hdop_filter;
    const minRssi = request.query.min_rssi;
    const maxRssi = request.query.max_rssi;

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
                where: {
                    rssi: {
                        gte: minRssi ? Number(minRssi) : -1000,
                        lte: maxRssi ? Number(maxRssi) : 1000,
                    },
                    deviceGPSDatapoint: {
                        hdop: {
                            lt: hdopFilter ? Number(hdopFilter) : 1000,
                        },
                    },
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
