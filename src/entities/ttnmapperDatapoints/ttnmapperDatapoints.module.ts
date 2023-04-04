import { TTNMapperDatapointsService } from './ttnmapperDatapoints.service';
import { TTNMapperDatapoint } from './ttnmapperDatapoints.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TTNMapperDatapointssController } from './ttnmapperDatapoints.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TTNMapperDatapoint])],
    providers: [TTNMapperDatapointsService],
    controllers: [TTNMapperDatapointssController],
})
export class TTNMapperDatapointssModule {}
