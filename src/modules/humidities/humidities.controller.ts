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
import { HumiditiesService } from './humidities.service';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Humidity } from './entities/humidity.entity';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchHumidityDto } from './dto/search-humidity.dto';
import { StatHumidityModel } from './models/stat-humidity.model';

@Controller()
export class HumiditiesController {
  constructor(private humiditiesService: HumiditiesService) {}

  @ApiTags('humidities')
  @ApiOperation({
    summary: 'List all humidities',
    description:
      'Obtain humidities statistics including min, max and average.\n\n' +
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
  @Get('locations/:locationId/humidities')
  findAll(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query() searchHumidityDto: SearchHumidityDto,
  ): Promise<StatHumidityModel[]> {
    return this.humiditiesService.findAll(locationId, searchHumidityDto);
  }

  @ApiTags('humidities')
  @ApiOperation({ summary: 'Get last humidity' })
  @ApiOkResponse({
    description: 'Get last humidity (or `null` if no humidities)',
    type: Humidity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/humidities/last')
  last(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.humiditiesService.last(locationId);
  }

  /********************************************
   * Applications
   ********************************************/

  @ApiTags('applications-humidities')
  @ApiOperation({ summary: 'Create a new humidity with an application' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiSecurity('apiKey')
  @UseGuards(AppKeyGuard)
  @Post('applications/locations/:locationId/humidities')
  create(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createHumidityDto: CreateHumidityDto,
  ): Promise<Humidity> {
    return this.humiditiesService.create(locationId, createHumidityDto);
  }

  @ApiTags('applications-humidities')
  @ApiOperation({ summary: 'Get last humidity with an application' })
  @ApiOkResponse({
    description: 'Get last humidity (or `null` if no humidities)',
    type: Humidity,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiSecurity('apiKey')
  @UseGuards(AppKeyGuard)
  @Get('applications/locations/:locationId/humidities/last')
  appLast(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.humiditiesService.last(locationId);
  }
}
