import express, { Request, Response } from 'express';
import GetterFunctions from '@/helpers/GetterFunctions';
import GetNewTTNMapperDataJob from '@/scheduledFunctions/GetNewTTNMapperDataJob';
import FormattingHelpers from '@/helpers/FormattingHelpers';
import prisma from '@/global/prisma';

// Auth middleware
import apiKeyAuthMiddleware from '@/middleware/apiKeyAuth';
import AddSpreadingFactorRetroactively from '@/helpers/AddSpreadingFactorRetroactively';

const router = express.Router();

// 🏚️ Default Route

// This is the Default Route of the API
router.get('/', async (request: Request, response: Response) => {
    const numberOfDeviceSubscriptions = await GetterFunctions.getAmountOfDeviceSubscriptions();

    const uptime = GetterFunctions.getServerUptimeSeconds();

    const subscribedDevicesIDs = await prisma.device.findMany({
        where: {
            subscription: true,
        },
        select: {
            deviceId: true,
        },
    });

    response.send({
        message: `Hello from ttn-locator-backend!`,
        metadata: {
            deviceSubscriptions: {
                currentAmountOfDeviceSubscriptions: numberOfDeviceSubscriptions,
                subscribedDevicesIDs: subscribedDevicesIDs.map(
                    (eachDevice: { deviceId: string }) => eachDevice.deviceId,
                ),
            },
            deviceGpsDatapoints: {
                currentAmountOfDeviceGpsDatapoints: await prisma.deviceGPSDatapoint.count(),
            },
            gateways: {
                currentAmountOfGateways: await prisma.gateway.count(),
            },
        },
        lastUpdated: GetNewTTNMapperDataJob.getInstance().lastUpdatedPrintString(),
        uptime: FormattingHelpers.prettyPrintSecondsAsDurationString(uptime),
    });
});

// 🏚️ Healthcheck Route
router.get('/healthcheck', async (request: Request, response: Response) => {
    response.send({ message: 'OK' });
});

router.post('/fetch_device_data', apiKeyAuthMiddleware, async (_request: Request, _response: Response) => {
    GetNewTTNMapperDataJob.getInstance()
        .executeJob()
        .then(() => {
            _response.send({ message: 'OK' });
        })

        .catch(() => {
            _response.send({ message: 'ERROR' });
        });
});

router.post('/updateSpreadingFactors', apiKeyAuthMiddleware, async (_request: Request, _response: Response) => {
    AddSpreadingFactorRetroactively.updateExistingDeviceGpsDatapoints()
        .then((amountOfDeviceGpsDatapointsWithoutSpreadingFactor) => {
            _response.send({
                message: 'OK',
                amountOfDeviceGpsDatapointsWithoutSpreadingFactor: amountOfDeviceGpsDatapointsWithoutSpreadingFactor,
            });
        })
        .catch(() => {
            _response.send({ message: 'ERROR' });
        });
});

export default router;
