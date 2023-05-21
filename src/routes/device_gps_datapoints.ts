import express, { Request, Response } from 'express';
import logger from '@/middleware/logger';
import prisma from '@/global/prisma';
import RssiSimilarityFilter from '@/types/RssiSimilarityFilter';
import DeviceGPSDatapointsHelper from '@/helpers/DeviceGPSDatapointsHelper';
import { DeviceGPSDatapoint } from '@prisma/client';

const router = express.Router();

// 📍 Device GPS datapoints

// Get all device GPS datapoints
router.get('/', async (request: Request, response: Response) => {
    const minTTNMapperDatapoints: number = parseInt(<string>request.query.min_ttnmapper_datapoints) || 0;
    const maxHDOP: number = parseFloat(<string>request.query.max_hdop) || 10;
    const limit: number = Number(request.query.limit) || 1000;

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
                AND "DeviceGPSDatapoint".hdop <= ${maxHDOP}
            LIMIT ${limit};
        `;

    response.send({
        data: deviceGPSDatapoints,
    });
});

// Get the count of device gps datapoints grouped by the count of related ttn mapper datapoints
router.get('/count_by_ttnmapper_datapoints', async (_request: Request, response: Response) => {
    interface DatapointsCountQueryResult {
        ttn_mapper_datapoints_count: number;
        gps_datapoints_amount: number;
    }

    const dbQueryResult = (await prisma.$queryRaw`
        SELECT COUNT(*) as gps_datapoints_amount, ttn_mapper_datapoints_count as ttn_mapper_datapoints_count
        FROM (
            SELECT d.id, COUNT(t.id) as ttn_mapper_datapoints_count
            FROM "DeviceGPSDatapoint" d
            LEFT JOIN "TtnMapperDatapoint" t ON d.id = t."deviceGPSDatapointId"
            GROUP BY d.id
        ) subquery
        GROUP BY ttn_mapper_datapoints_count
        ORDER BY ttn_mapper_datapoints_count;
    `) as DatapointsCountQueryResult[];

    const convertedResult = dbQueryResult.map((eachRow) => ({
        count: Number(eachRow.ttn_mapper_datapoints_count),
        amount: Number(eachRow.gps_datapoints_amount),
    }));

    response.send({
        data: convertedResult,
    });
});

// Get GPS datapoint by id, including all TTNMapper datapoints
router.get('/:id', async (request: Request, response: Response) => {
    const deviceGPSDatapoint = await prisma.deviceGPSDatapoint.findUnique({
        where: {
            id: Number(request.params.id),
        },
        include: {
            ttnMapperDatapoints: true,
        },
    });

    if (!deviceGPSDatapoint) {
        response.status(404).send({
            error: 'Device GPS datapoint not found',
        });
        return;
    }

    response.send({
        data: deviceGPSDatapoint,
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
    const similarityFilter: RssiSimilarityFilter[] = request.body.similarityFilter;

    if (!similarityFilter || similarityFilter.length === 0) {
        response.status(400).send({ error: 'No similarity filter provided' });
        return;
    }

    logger.info(
        `Getting all device GPS datapoints that match the similarity filter: ${JSON.stringify(similarityFilter)}`,
    );

    const filteredDeviceGPSDatapoints = await DeviceGPSDatapointsHelper.getMatchingDeviceGPSDatapointsFromFilter(
        similarityFilter,
    );

    response.send({
        message: `Found ${filteredDeviceGPSDatapoints.length} device GPS datapoints that match the similarity filter`,
        data: filteredDeviceGPSDatapoints,
    });
});

export default router;
