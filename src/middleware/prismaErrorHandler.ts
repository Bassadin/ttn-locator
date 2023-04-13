import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import logger from '@/middleware/logger';

export default function prismaErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Catch all known errors from Prisma Client
        logger.error({ type: 'PrismaError', error: err });
        res.status(500).json({ error: 'Database Error' });
    } else {
        // Pass the error to the next middleware function
        next(err);
    }
}
