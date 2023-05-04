import express, { Request, Response } from 'express';
import GetterFunctions from '@/helpers/GetterFunctions';
import GetNewTTNMapperDataCronJob from '@/scheduledFunctions/getNewTTNMapperData';

const router = express.Router();

// 🏚️ Default Route

// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    const numberOfDeviceSubscriptions = await GetterFunctions.getAmountOfDeviceSubscriptions();
    response.send({
        message: `Hello from ttn-locator-backend!\nCurrent amount of Device subscriptions: ${numberOfDeviceSubscriptions}`,
    });
});

// 🏚️ Healthcheck Route
router.get('/healthcheck', async (request: Request, response: Response) => {
    response.send({
        message: 'OK',
    });
});

router.post('/fetch_device_data', async (_request: Request, _response: Response) => {
    GetNewTTNMapperDataCronJob.getNewTTNMapperDataForSubscribedDevices();
});

export default router;
