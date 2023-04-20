import prisma from '@/global/prisma';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';
import express, { Request, Response } from 'express';

const router = express.Router();

// 🖁 Devices

// Get all devices
router.get('/', async (request: Request, response: Response) => {
    const devices = await prisma.device.findMany();
    response.send({ message: 'success', data: devices });
});

// Add a new device
router.post('/', async (request: Request, response: Response) => {
    logger.debug('Adding new device: ' + request.body.deviceId);
    if (!(await TTNMapperConnection.checkIfDeviceExistsOnTtnMapper(request.body.deviceId))) {
        response.status(400).send({ message: 'Device does not exist on TTN Mapper' });
        return;
    }

    const device = await prisma.device.upsert({
        where: { deviceId: request.body.deviceId },
        update: {
            subscription: request.body.subscription,
        },
        create: {
            deviceId: request.body.deviceId,
            subscription: request.body.subscription,
        },
    });
    response.send({ message: 'success', data: device });
});

// Get device info from TTN Mapper by id
router.get('/ttnmapper_api/:id', async (request: Request, response: Response) => {
    const startDate = new Date(Date.now() - 30 * (24 * 60 * 60 * 1000));
    const apiResponse = await TTNMapperConnection.getNewTTNMapperDataForDevice(request.params.id, startDate);
    response.send({ message: 'success', amountOfRecords: apiResponse.body.length });
});

export default router;
