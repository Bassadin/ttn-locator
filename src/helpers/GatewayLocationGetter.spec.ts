import GatewayLocationGetter from '@/helpers/GatewayLocationGetter';

describe('Test GatewayLocationGetter class', () => {
    test(`Test a real gateway's location`, async () => {
        // This is the location of the gateway "eui-ac1f09fffe06048e" (Innolab RAKete in Furtwangen)
        const gatewayLocation = await GatewayLocationGetter.getGatewayLocationFromPacketBrokerAPI(
            'eui-ac1f09fffe06048e',
        );
        expect(gatewayLocation.latitude).toBe(48.050308050849);
        expect(gatewayLocation.longitude).toBe(8.20961392848371);
        expect(gatewayLocation.altitude).toBe(879);
    });

    test(`Test calling the method with an invalid ID`, async () => {
        await expect(GatewayLocationGetter.getGatewayLocationFromPacketBrokerAPI('invalid_id')).rejects.toThrowError();
    });
});
