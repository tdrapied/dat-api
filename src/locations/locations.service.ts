import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Detail } from '../details/entities/detail.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  findDetails(locationId: string): Promise<Detail[]> {
    return this.detailRepository.find({
      where: { location: { id: locationId } },
    });
  }
}
