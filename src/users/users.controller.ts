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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.usersService.create(createUserDto, req.user.userId);
  }

  @Get()
  @Roles('admin')
  findAll(@Req() req) {
    return this.usersService.findAll(req.user.userId);
  }

  @Get('paginated')
  @Roles('admin')
  async findAllPaginated(
    @Req() req,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string
  ) {
    const skipNumber = parseInt(skip) || 0;
    const limitNumber = parseInt(limit) || 10;
    return this.usersService.findAllPaginated(
      skipNumber,
      limitNumber,
      req.user.userId
    );
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, req.user.userId, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(id, req.user.userId);
  }
}
