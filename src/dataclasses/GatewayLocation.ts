export default class GatewayLocation {
    constructor(public latitude: number, public longitude: number, public altitude: number) {}

    // https://stackoverflow.com/a/27943
    getMeterDistanceTo(otherGateway: GatewayLocation): number {
        const earthRadius = 6371e3; // Earth's radius in meters
        const lat1 = this.latitude * (Math.PI / 180);
        const lat2 = otherGateway.latitude * (Math.PI / 180);
        const deltaLat = (otherGateway.latitude - this.latitude) * (Math.PI / 180);
        const deltaLon = (otherGateway.longitude - this.longitude) * (Math.PI / 180);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }
}
