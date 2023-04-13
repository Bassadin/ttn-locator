import { Request, Response, NextFunction } from 'express';
import logger from '@/middleware/logger';

export default function catchAllErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    logger.error({ type: 'OtherError', error: err });
    res.status(500).json('Whoops. Internal Server Error!');
}
