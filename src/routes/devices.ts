import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (request: Request, response: Response) => {
    const devices = await prisma.device.findMany();
    response.send({ message: 'success', data: devices });
});

router.get('/ttnmapper_api/:id', async (request: Request, response: Response) => {
    const apiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(request.params.id);
    response.send({ message: 'success', amountOfRecords: apiResponse.body.length });
});

export default router;
