import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(currentUser: User): Location[] {
    return currentUser.locations;
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
