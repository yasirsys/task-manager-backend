import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { GetUsersQueryDto } from './dto/get-users-query.dto';

import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto, @GetUser('userId') adminId) {
    return this.usersService.create(createUserDto, adminId);
  }

  @Get()
  @Roles('admin')
  findAll(@GetUser('userId') adminId) {
    return this.usersService.findAll(adminId);
  }

  @Get('paginated')
  @Roles('admin')
  async findAllPaginated(
    @GetUser('userId') adminId,
    @Query() query: GetUsersQueryDto
  ) {
    return this.usersService.findAllPaginated(
      query.skip || 0,
      query.limit || 10,
      adminId
    );
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string, @GetUser('userId') adminId) {
    return this.usersService.findOne(id, adminId);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @GetUser('userId') adminId,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, adminId, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @GetUser('userId') adminId) {
    return this.usersService.remove(id, adminId);
  }
}
