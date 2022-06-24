import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HumiditiesService } from './humidities.service';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Humidity } from './entities/humidity.entity';

@ApiTags('humidities')
@Controller('location/:locationId/humidities')
export class HumiditiesController {
  constructor(private humiditiesService: HumiditiesService) {}

  @ApiOperation({ summary: 'Create a new humidity' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @Post()
  create(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createHumidityDto: CreateHumidityDto,
  ): Promise<Humidity> {
    return this.humiditiesService.create(locationId, createHumidityDto);
  }

  @ApiOperation({ summary: 'Get last humidity' })
  @ApiOkResponse({
    description: 'Get last humidity (or `null` if no humidities)',
    type: Humidity,
  })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @Get('last')
  last(
    @Param('locationId', ParseUUIDPipe) locationId: string,
  ): Promise<Humidity> {
    return this.humiditiesService.last(locationId);
  }
}
