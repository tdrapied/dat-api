import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(req.user, createUserDto);
  }

  @ApiOperation({ summary: 'Validate user with a code and new password' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(204)
  @Post('activate')
  validate(@Body() validateUserDto: ValidateUserDto): Promise<void> {
    return this.usersService.validate(validateUserDto);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req): Promise<User[]> {
    return this.usersService.findAll(req.user);
  }

  @ApiOperation({ summary: 'Get one user by id' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(req.user, id);
  }
}
