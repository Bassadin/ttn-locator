import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 🏚️ Default Route
// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    const numberOfDeviceSubscriptions = await prisma.device_subscription.count();
    response.send({
        message: `Hello from ttnmapper-reader!\nCurrent amount of device subscriptions: ${numberOfDeviceSubscriptions}`,
    });
});

export default router;
