import { Request, Response, NextFunction } from 'express';

export default function catchAllErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err) {
        res.status(500).json({ error: err.message });
    } else {
        // Pass the error to the next middleware function
        next(err);
    }
}
