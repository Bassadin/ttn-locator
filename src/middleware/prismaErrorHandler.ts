import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import logger from 'src/middleware/logger';

export default function prismaErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.debug('prismaErrorHandler: ' + err.message);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Catch all known errors from Prisma Client
        res.status(500).json({ error: err.message });
    } else {
        // Pass the error to the next middleware function
        next(err);
    }
}
