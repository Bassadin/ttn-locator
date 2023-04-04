import { TTNMapperDatapoint } from './ttnmapperDatapoints.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TTNMapperDatapointsService {
    constructor(
        @InjectRepository(TTNMapperDatapoint)
        private ttnmapperMeasurementsRepository: Repository<TTNMapperDatapoint>,
    ) {}

    findAll(): Promise<TTNMapperDatapoint[]> {
        return this.ttnmapperMeasurementsRepository.find();
    }

    findOne(id: number): Promise<TTNMapperDatapoint | null> {
        return this.ttnmapperMeasurementsRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.ttnmapperMeasurementsRepository.delete(id);
    }
}
