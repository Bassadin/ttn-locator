import GatewayLocation from '@/dataclasses/GatewayLocation';

describe('Test GatewayLocation class', () => {
    test('Test instantiating GatewayLocation', async () => {
        new GatewayLocation(1.0, 2.0, 3.0);
    });
});
