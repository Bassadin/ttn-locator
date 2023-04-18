import GatewayLocation from '@/dataclasses/GatewayLocation';

describe('Test GatewayLocation class', () => {
    test('Test instantiating GatewayLocation', async () => {
        new GatewayLocation(1.0, 2.0, 3.0);
    });

    test('Test getMeterDistanceTo() function with zero distance', async () => {
        const location1 = new GatewayLocation(52.0, 13.0, 0.0);
        const location2 = new GatewayLocation(52.0, 13.0, 0.0);

        expect(location1.getMeterDistanceTo(location2)).toEqual(0);
    });

    test('Test getMeterDistanceTo() function with non-zero distance', async () => {
        const location1 = new GatewayLocation(10.0, 10.0, 0.0);
        const location2 = new GatewayLocation(20.0, 20.0, 0.0);

        expect(location1.getMeterDistanceTo(location2)).toBeGreaterThan(1544757);
        expect(location1.getMeterDistanceTo(location2)).toBeLessThan(1544758);
    });
});
