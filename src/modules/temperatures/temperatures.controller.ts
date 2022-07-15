import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TemperaturesService } from './temperatures.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Temperature } from './entities/temperature.entity';
import { Humidity } from '../humidities/entities/humidity.entity';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatTemperatureModel } from './models/stat-temperature.model';
import { SearchAirTemperatureDto } from './dto/search-air-temperature.dto';

@Controller()
export class TemperaturesController {
  constructor(private readonly temperaturesService: TemperaturesService) {}

  @ApiTags('temperatures')
  @ApiOperation({
    summary: 'List all air temperatures',
    description:
      'Obtain air temperatures statistics including min, max and average.\n\n' +
      '**The granularity of the data is automatic (cannot be adjusted).**\n\n' +
      '- less than 1 day = 5 minute interval data\n' +
      '- 1 - 7 days (1 week) = hourly data\n' +
      '- 8 - 90 days (~3 months) = daily data\n' +
      '- 91 - 365 days (~ 1 year) = weekly data\n' +
      '- more than 365 days = monthly data',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/temperatures/air')
  findAll(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query() searchAirTemperatureDto: SearchAirTemperatureDto,
  ): Promise<StatTemperatureModel[]> {
    return this.temperaturesService.findAllAir(
      locationId,
      searchAirTemperatureDto,
    );
  }

  @ApiTags('temperatures')
  @ApiOperation({ summary: 'Get last air temperature' })
  @ApiOkResponse({
    description: 'Get last air temperature (or `null` if no air temperatures)',
    type: Humidity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/temperatures/air/last')
  last(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.temperaturesService.lastAir(locationId);
  }

  /********************************************
   * Applications
   ********************************************/

  @ApiTags('applications-temperatures')
  @ApiOperation({
    summary: 'Create a new temperature with an application',
    description: 'Note: `SOIL` type is not supported currently',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiSecurity('apiKey')
  @UseGuards(AppKeyGuard)
  @Post('applications/locations/:locationId/temperatures')
  create(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createTemperatureDto: CreateTemperatureDto,
  ): Promise<Temperature> {
    return this.temperaturesService.create(locationId, createTemperatureDto);
  }

  @ApiTags('applications-temperatures')
  @ApiOperation({ summary: 'Get last air temperature with an application' })
  @ApiOkResponse({
    description: 'Get last air temperature (or `null` if no air temperatures)',
    type: Humidity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiSecurity('apiKey')
  @UseGuards(AppKeyGuard)
  @Get('applications/locations/:locationId/temperatures/air/last')
  appLast(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.temperaturesService.lastAir(locationId);
  }
}
