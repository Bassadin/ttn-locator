import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 🏚️ Default Route

// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    const numberOfDeviceSubscriptions = await prisma.deviceSubscription.count();
    response.send({
        message: `Hello from ttnmapper-reader!\nCurrent amount of Device subscriptions: ${numberOfDeviceSubscriptions}`,
    });
});

// 🏚️ Healthcheck Route
router.get('/healthcheck', async (request: Request, response: Response) => {
    response.send({
        message: 'OK',
    });
});

export default router;
