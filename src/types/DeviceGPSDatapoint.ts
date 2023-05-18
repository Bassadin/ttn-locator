export default class DeviceGPSDatapoint {
    constructor(
        public dev_id: string,

        public latitude: number,
        public longitude: number,
        public altitude: number,

        public gateway_id: string,
        public rssi: number,
        public snr: number,
        public hdop: number,
        public database_id: number,
        public time: Date,
        public gateway_time: Date,
    ) {}
}
