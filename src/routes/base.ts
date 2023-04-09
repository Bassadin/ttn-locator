import express, { Request, Response } from 'express';

const router = express.Router();

// 🏚️ Default Route
// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    response.send({ message: 'Hello from ttnmapper-reader!' });
});

export default router;
