import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class TTNMapperMeasurement {
    @PrimaryColumn()
    id: number;

    @Column()
    GatewayEUI: string;

    @Column()
    rssi: number;

    @Column()
    snr: number;
}
