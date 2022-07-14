import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { LocationsService } from '../locations/locations.service';
import { Decision, DecisionType } from './entities/decision.entity';

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

  async last(locationId: string, decisionType: string): Promise<Decision> {
    if (!DecisionType[decisionType]) {
      throw new BadRequestException(`Invalid decision type`);
    }

    const location = await this.locationService.getLocationIfExists(locationId);

    return this.decisionRepository.findOne({
      where: {
        location,
        type: DecisionType[decisionType],
        createdAt: LessThanOrEqual(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
