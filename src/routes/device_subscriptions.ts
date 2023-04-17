import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Get all Device subscriptions
router.get('/', async (request: Request, response: Response) => {
    response.send({ message: 'success', data: await prisma.deviceSubscription.findMany() });
});

// Add a Device subscription
router.post('/', async (request: Request, response: Response) => {
    const newSubscription = await prisma.deviceSubscription.upsert({
        where: { deviceId: request.body.deviceId },
        update: {},
        create: {
            device: { connect: { deviceId: request.body.deviceId } },
        },
    });
    response.send({ message: 'success', data: newSubscription });
});

export default router;
