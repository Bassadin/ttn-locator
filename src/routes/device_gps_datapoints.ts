import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 📍 Device GPS datapoints

// Get all device GPS datapoints
router.get('/', async (request: Request, response: Response) => {
    const deviceGPSDatapoints = await prisma.deviceGPSDatapoint.findMany();
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

// Get device GPS datapoint with 3 ttnmapper datapoints or more
router.get('/with_3_or_more_ttnmapper_datapoints', async (request: Request, response: Response) => {
    // TODO
    response.status(200).send();
});

export default router;
