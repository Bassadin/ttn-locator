import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTTNMapperTables1680621680387 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE ttnmapper_datapoints (
                "id" SERIAL NOT NULL,
                "GatewayEUI" character varying NOT NULL,
                "rssi" integer NOT NULL,
                "snr" integer NOT NULL
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ttnmapper_datapoints"`);
    }
}
