import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express, { Request, Response } from 'express';

// Express instance
const app = express();

app.use(express.json());

// 🏚️ Default Route
// This is the Default Route of the API
app.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'Hello from ttnmapper-reader!' });
});

// Create new user
// This is the Route for creating a new user via POST Method
app.get('/ttnmapper_datapoints', async (req: Request, res: Response) => {
    const ttnmapper_datapoints = await prisma.ttnmapper_datapoint.findMany();
    res.json({ message: 'success', data: ttnmapper_datapoints });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});
