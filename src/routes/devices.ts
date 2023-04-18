import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// 🖁 Devices

// Get all devices
router.get('/', async (request: Request, response: Response) => {
    const devices = await prisma.device.findMany();
    response.send({ message: 'success', data: devices });
});

// Get device info from TTN Mapper by id
router.get('/ttnmapper_api/:id', async (request: Request, response: Response) => {
    const startDate = new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
    const apiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(request.params.id, startDate);
    response.send({ message: 'success', amountOfRecords: apiResponse.body.length });
});

export default router;
