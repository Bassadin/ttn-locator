import prisma from '@/global/prisma';
import TTNMapperConnection from '@/helpers/TTNMapperConnection';
import logger from '@/middleware/logger';
import express, { Request, Response } from 'express';

const router = express.Router();

// 🖁 Devices

// Get all devices
router.get('/', async (request: Request, response: Response) => {
    const devices = await prisma.device.findMany({
        include: {
            _count: {
                select: { deviceGPSDatapoints: true },
            },
        },
    });
    response.send({ message: 'success', data: devices });
});

// Create a new device
router.post('/', async (request: Request, response: Response) => {
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

// Change the subscription of a device
router.put('/:id', async (request: Request, response: Response) => {
    const device = await prisma.device.update({
        where: { deviceId: request.params.id },
        data: {
            subscription: request.body.subscription,
        },
    });
    response.send({ message: 'success', data: device });
});

// Delete a device (associated GPS datapoints will be deleted as well because of the cascading delete rule)
router.delete('/:id', async (request: Request, response: Response) => {
    const device = await prisma.device.delete({
        where: { deviceId: request.params.id },
    });

    if (!device) {
        response.status(404).send({ message: 'Device not found' });
        return;
    }

    response.send({ message: 'success', data: device });
});

export default router;
