import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Get all device subscriptions
router.get('/', async (request: Request, response: Response) => {
    response.send({ message: 'success', data: await prisma.device_subscription.findMany() });
});

// Add a device subscription
router.post('/', async (request: Request, response: Response) => {
    const newSubscription = await prisma.device_subscription.create({
        data: {
            device_id: request.body.device_id,
        },
    });
    response.send({ message: 'success', data: newSubscription });
});

export default router;
