import { Injectable } from '@nestjs/common';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationsService } from '../locations/locations.service';
import { Decision } from './entities/decision.entity';

@Injectable()
export class DecisionsService {
  constructor(
    @InjectRepository(Decision)
    private readonly decisionRepository: Repository<Decision>,
    private locationService: LocationsService,
  ) {}

  async create(
    locationId: string,
    createDecisionDto: CreateDecisionDto,
  ): Promise<Decision> {
    const location = await this.locationService.getLocationIfExists(locationId);

    const decision = new Decision();
    decision.value = createDecisionDto.value;
    decision.type = createDecisionDto.type;
    decision.location = location;

    return this.decisionRepository.save(decision);
  }
}
