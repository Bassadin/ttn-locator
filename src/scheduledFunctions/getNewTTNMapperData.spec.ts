import GetNewTTNMapperDataCronJob from '@/scheduledFunctions/getNewTTNMapperData';

describe('Test GetNewTTNMapperDataCronJob methods', () => {
    test('getNewTTNMapperDataForSubscribedDevices()', async () => {
        GetNewTTNMapperDataCronJob.getNewTTNMapperDataForSubscribedDevices();
    });

    test('updateGatewayLocation()', async () => {
        GetNewTTNMapperDataCronJob.updateGatewayLocation('mikrotik-lr8-001');
    });
});
