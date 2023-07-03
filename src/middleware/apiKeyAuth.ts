import { Request, Response, NextFunction } from 'express';
import logger from '@/middleware/logger';

export default function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.get('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        logger.warn(`API key ${apiKey} doesn't match`);
        res.status(401).json({ error: 'API key unauthorized' });
    } else {
        next();
    }
}
