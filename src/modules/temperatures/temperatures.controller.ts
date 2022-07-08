import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TemperaturesService } from './temperatures.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Temperature } from './entities/temperature.entity';
import { Humidity } from '../humidities/entities/humidity.entity';

@ApiTags('temperatures')
@Controller('location/:locationId/temperatures')
export class TemperaturesController {
  constructor(private readonly temperaturesService: TemperaturesService) {}

  @ApiOperation({
    summary: 'Create a new temperature',
    description: 'Note: `SOIL` type is not supported currently',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @Post()
  create(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createTemperatureDto: CreateTemperatureDto,
  ): Promise<Temperature> {
    return this.temperaturesService.create(locationId, createTemperatureDto);
  }

  @ApiOperation({ summary: 'Get last air temperature' })
  @ApiOkResponse({
    description: 'Get last air temperature (or `null` if no air temperatures)',
    type: Humidity,
  })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @Get('air/last')
  last(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.temperaturesService.lastAir(locationId);
  }
}
