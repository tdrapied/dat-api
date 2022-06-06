import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Location } from './entities/location.entity';
import { Detail } from '../details/entities/detail.entity';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @ApiOperation({ summary: 'List all locations' })
  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @ApiOperation({ summary: 'List all details by location' })
  @Get(':locationId/details')
  findDetails(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Detail[]> {
    return this.locationsService.findDetails(locationId);
  }
}
