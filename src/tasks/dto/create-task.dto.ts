import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/constants/task.constants';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsNotEmpty()
  assignedTo: Types.ObjectId; // ID of the user who gets the task
}
