import { Controller, Get, Post, Body } from '@nestjs/common';
import { HumiditiesService } from './humidities.service';
import { CreateHumidityDto } from './dto/create-humidity.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Humidity } from './entities/humidity.entity';

@ApiTags('humidities')
@Controller('humidities')
export class HumiditiesController {
  constructor(private humiditiesService: HumiditiesService) {}

  @ApiOperation({ summary: 'Create a new humidity' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  create(@Body() createHumidityDto: CreateHumidityDto): Promise<Humidity> {
    return this.humiditiesService.create(createHumidityDto);
  }

  @ApiOperation({ summary: 'Get last humidity' })
  @ApiOkResponse({
    description: 'Get last humidity (or `null` if no humidities)',
    type: Humidity,
  })
  @Get('last')
  last(): Promise<Humidity> {
    return this.humiditiesService.last();
  }
}
