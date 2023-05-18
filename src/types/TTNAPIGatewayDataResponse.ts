import Location from '@/dataclasses/Location';

// The Things Network (https://www.thethingsnetwork.org/gateway-data/gateway/hfu-lr8-001)
export default class TTNAPIGatewayDataResponse {
    constructor(
        public network: string,
        public id: string,
        public name: string,
        public description: string,
        public location: Location,
        public country_code: string,
        public online: boolean,
        public last_seen: string,
    ) {}
}
