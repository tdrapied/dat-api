import { Controller, Get } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Location } from './entities/location.entity';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @ApiOperation({ summary: 'List all locations' })
  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }
}
