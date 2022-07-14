import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { DecisionsService } from './decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppKeyGuard } from '../auth/guards/app-key.guard';
import { Decision } from './entities/decision.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @ApiTags('decisions')
  @ApiOperation({
    summary: 'Get last decision by type',
    description: 'Get last decision by type (or `null` if no decisions)',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Location not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('locations/:locationId/decisions/:decisionType/last')
  last(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Param('decisionType') decisionType: string,
  ): Promise<Decision> {
    return this.decisionsService.last(locationId, decisionType);
  }

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
  ): Promise<Decision> {
    return this.decisionsService.create(locationId, createDecisionDto);
  }
}
