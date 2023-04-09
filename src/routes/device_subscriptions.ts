import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (request: Request, response: Response) => {
    response.send({ message: 'success', data: await prisma.device_subscription.findMany() });
});

export default router;
