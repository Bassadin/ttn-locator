import { Request, Response, NextFunction } from 'express';
import logger from 'src/middleware/logger';

export default function catchAllErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    logger.error('catchAllErrorHandler: ' + err.message);
    res.status(500).json('Internal Server Error');
}
