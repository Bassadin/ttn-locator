import express, { Request, Response } from 'express';
import GetterFunctions from '@/helpers/GetterFunctions';
import GetNewTTNMapperDataJob from '@/scheduledFunctions/GetNewTTNMapperDataJob';
import FormattingHelpers from '@/helpers/FormattingHelpers';

const router = express.Router();

// 🏚️ Default Route

// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    const numberOfDeviceSubscriptions = await GetterFunctions.getAmountOfDeviceSubscriptions();

    const uptime = GetterFunctions.getServerUptimeSeconds();

    response.send({
        message: `Hello from ttn-locator-backend!`,
        currentAmountOfDeviceSubscriptions: numberOfDeviceSubscriptions,
        lastUpdated: GetNewTTNMapperDataJob.getInstance().lastUpdatedPrintString(),
        uptime: FormattingHelpers.prettyPrintSecondsAsDurationString(uptime),
    });
});

// 🏚️ Healthcheck Route
router.get('/healthcheck', async (request: Request, response: Response) => {
    response.send({ message: 'OK' });
});

router.post('/fetch_device_data', async (_request: Request, _response: Response) => {
    await GetNewTTNMapperDataJob.getInstance().executeJob();

    _response.send({ message: 'OK' });
});

export default router;
