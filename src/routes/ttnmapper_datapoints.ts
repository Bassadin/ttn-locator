import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (request: Request, response: Response) => {
    const ttnmapper_datapoints = await prisma.ttnMapperDatapoint.findMany();
    response.send({ message: 'success', data: ttnmapper_datapoints });
});

export default router;
