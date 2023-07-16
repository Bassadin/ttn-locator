export default class Location {
    constructor(
        public latitude: number,
        public longitude: number,
        public altitude: number,
    ) {}

    // https://stackoverflow.com/a/27943
    getMeterDistanceWithoutAltitudeTo(other: Location): number {
        const earthRadius = 6371e3; // Earth's radius in meters
        const lat1 = this.latitude * (Math.PI / 180);
        const lat2 = other.latitude * (Math.PI / 180);
        const deltaLat = (other.latitude - this.latitude) * (Math.PI / 180);
        const deltaLon = (other.longitude - this.longitude) * (Math.PI / 180);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }
}
