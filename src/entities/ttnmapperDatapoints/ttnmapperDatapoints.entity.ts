import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class TTNMapperDatapoint {
    @PrimaryColumn()
    id: number;

    @Column()
    GatewayEUI: string;

    @Column()
    rssi: number;

    @Column()
    snr: number;
}
