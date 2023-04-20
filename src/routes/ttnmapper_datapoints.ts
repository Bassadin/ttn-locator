import prisma from '@/global/prisma';
import express, { Request, Response } from 'express';

const router = express.Router();

// 🗺️ TTNMapper datapoints

// Get all TTNMapper datapoints
router.get('/', async (request: Request, response: Response) => {
    const ttnmapper_datapoints = await prisma.ttnMapperDatapoint.findMany();
    response.send({ message: 'success', data: ttnmapper_datapoints });
});

export default router;
