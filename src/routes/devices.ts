import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (request: Request, response: Response) => {
    const devices = await prisma.device.findMany();
    response.send({ message: 'success', data: devices });
});

export default router;
