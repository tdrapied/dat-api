import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  /********************************************
   * Other methods
   * ******************************************/

  async getLocationIfExists(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    if (!location) {
      throw new NotFoundException(`Location not found`);
    }
    return location;
  }
}
