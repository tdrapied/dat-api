import { Controller, Get, Post, Body } from '@nestjs/common';
import { DetailsService } from './details.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Detail } from './entities/detail.entity';

@ApiTags('details')
@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  create(@Body() createDetailDto: CreateDetailDto): Promise<Detail> {
    return this.detailsService.create(createDetailDto);
  }

  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('last')
  last(): Promise<Detail> {
    return this.detailsService.last();
  }
}
