import express, { Request, Response } from 'express';
import logger from '@/middleware/logger';
import prisma from '@/global/prisma';
import { RssiSimilarityFilter } from '@/types/GPSDatapoints';

const router = express.Router();

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
router.get('/:id/ttnmapper_datapoints_with_gateway_locations', async (request: Request, response: Response) => {
    const deviceGPSDatapoints = await prisma.deviceGPSDatapoint.findUnique({
        where: {
            id: Number(request.params.id),
        },
        select: {
            ttnMapperDatapoints: {
                select: {
                    id: true,
                    rssi: true,
                    snr: true,
                    timestamp: true,
                    gateway: {
                        select: {
                            gatewayId: true,
                            latitude: true,
                            longitude: true,
                            altitude: true,
                        },
                    },
                },
            },
        },
    });

    if (!deviceGPSDatapoints) {
        response.status(404).send({
            error: 'Device GPS datapoint not found',
        });
        return;
    }

    response.send({
        data: deviceGPSDatapoints.ttnMapperDatapoints,
    });
});

// Get all gps datapoints for a specific set of gateways and rssi ranges
router.post('/rssi_similarity', async (request: Request, response: Response) => {
    const similarityData: RssiSimilarityFilter[] = request.body.similarityFilter;

    if (!similarityData || similarityData.length === 0) {
        response.status(400).send({ error: 'No similarity filter provided' });
        return;
    }

    logger.info(
        `Getting all device GPS datapoints that match the similarity filter: ${JSON.stringify(similarityData)}`,
    );

    // TODO: Not sure how to do this without any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaFilterQuery: any = {
        AND: [],
    };

    for (const filterCriteria of similarityData) {
        prismaFilterQuery.AND.push({
            ttnMapperDatapoints: {
                some: {
                    gateway: {
                        gatewayId: filterCriteria.gatewayId,
                    },
                    rssi: {
                        gte: filterCriteria.minRssi,
                        lte: filterCriteria.maxRssi,
                    },
                },
            },
        });
    }

    const filteredDeviceGPSDatapoints = await prisma.deviceGPSDatapoint.findMany({ where: prismaFilterQuery });

    response.send({
        message: `Found ${filteredDeviceGPSDatapoints.length} device GPS datapoints that match the similarity filter`,
        data: filteredDeviceGPSDatapoints,
    });
});

export default router;
