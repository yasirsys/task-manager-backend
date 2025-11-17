import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { UserRole } from 'src/constants/user.constants';

import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser('userId') adminId
  ) {
    return this.tasksService.create(createTaskDto, adminId);
  }

  @Get()
  async getTasks(@Query() query: GetTasksQueryDto, @GetUser('userId') adminId) {
    return this.tasksService.findAll(
      query.skip ?? 0,
      query.limit ?? 10,
      adminId
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser('userId') adminId) {
    return this.tasksService.findById(id, adminId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser('userId') adminId
  ) {
    return this.tasksService.update(id, adminId, updateTaskDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @GetUser('userId') adminId) {
    return this.tasksService.delete(id, adminId);
  }
}
