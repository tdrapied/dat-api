import { Controller, Get, Post, Body } from '@nestjs/common';
import { DetailsService } from './details.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Detail } from './entities/detail.entity';

@ApiTags('details')
@Controller('details')
export class DetailsController {
  constructor(private detailsService: DetailsService) {}

  @ApiOperation({ summary: 'Create a new detail' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  create(@Body() createDetailDto: CreateDetailDto): Promise<Detail> {
    return this.detailsService.create(createDetailDto);
  }

  @ApiOperation({ summary: 'Get last detail' })
  @ApiOkResponse({
    description: 'Get last detail (or `null` if no details)',
    type: Detail,
  })
  @Get('last')
  last(): Promise<Detail> {
    return this.detailsService.last();
  }
}
