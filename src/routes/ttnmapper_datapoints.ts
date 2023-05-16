import prisma from '@/global/prisma';
import express, { Request, Response } from 'express';

const router = express.Router();

// 🗺️ TTNMapper datapoints

// Get all TTNMapper datapoints
router.get('/', async (request: Request, response: Response) => {
    const ttnmapper_datapoints = await prisma.ttnMapperDatapoint.findMany();
    response.send({ message: 'success', data: ttnmapper_datapoints });
});

// Get single TTNMapper datapoint
router.get('/:id', async (request: Request, response: Response) => {
    const ttnmapper_datapoint = await prisma.ttnMapperDatapoint.findUnique({
        where: {
            id: Number(request.params.id),
        },
    });

    if (!ttnmapper_datapoint) {
        response.status(404).send({ message: 'TTNMapper datapoint not found' });
        return;
    }

    response.send({ message: 'success', data: ttnmapper_datapoint });
});

export default router;
