import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DecisionsService } from './decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppKeyGuard } from '../auth/guards/app-key.guard';

@Controller()
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  // TODO: Get last decision by location and type

  /********************************************
   * Applications
   ********************************************/

  @ApiTags('applications-decisions')
  @ApiOperation({
    summary: 'Create a new decision with an application',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiSecurity('apiKey')
  @UseGuards(AppKeyGuard)
  @Post('applications/locations/:locationId/decisions')
  create(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createDecisionDto: CreateDecisionDto,
  ) {
    return this.decisionsService.create(locationId, createDecisionDto);
  }
}
