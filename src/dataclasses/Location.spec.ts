import Location from '@/dataclasses/Location';

describe('Test Location class', () => {
    test('Test instantiating Location', async () => {
        new Location(1.0, 2.0, 0.0);
    });

    test('Test getMeterDistanceTo() function with zero distance', async () => {
        const location1 = new Location(52.0, 13.0, 0.0);
        const location2 = new Location(52.0, 13.0, 0.0);

        expect(location1.getMeterDistanceWithoutAltitudeTo(location2)).toEqual(0);
    });

    test('Test getMeterDistanceTo() function with non-zero distance', async () => {
        const location1 = new Location(10.0, 10.0, 0.0);
        const location2 = new Location(20.0, 20.0, 0.0);

        expect(location1.getMeterDistanceWithoutAltitudeTo(location2)).toBeGreaterThan(1544757);
        expect(location1.getMeterDistanceWithoutAltitudeTo(location2)).toBeLessThan(1544758);
    });
});
