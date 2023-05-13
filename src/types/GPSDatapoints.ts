export interface TTNMapperGatewayAPIDeviceGPSDatapoint {
    dev_id: string;

    latitude: number;
    longitude: number;
    altitude: number;

    gateway_id: string;
    rssi: number;
    snr: number;
    hdop: number;
    database_id: number;
    time: Date;
    gateway_time: Date;
}

export interface RssiSimilarityFilter {
    gatewayId: string;
    minRssi: number;
    maxRssi: number;
}
