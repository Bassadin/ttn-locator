// The Things Network (https://www.thethingsnetwork.org/gateway-data/gateway/hfu-lr8-001)
export interface TTNAPIGatewayDataResponse {
    network: string;
    id: string;
    name: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
        altitude: number;
    };
    country_code: string;
    attributes: {
        frequency_plan: string;
    };
    online: boolean;
    last_seen: string;
}
