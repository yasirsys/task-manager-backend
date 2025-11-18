import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from './schemas/task.schema';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksResponse } from './interfaces/tasks.interface';

const { ObjectId } = Types;
@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(
    createTaskDto: CreateTaskDto,
    adminId: string
  ): Promise<TaskDocument> {
    const task = new this.taskModel({
      ...createTaskDto,
      assignedTo: new ObjectId(createTaskDto.assignedTo),
      createdBy: new ObjectId(adminId)
    });
    return await task.save();
  }

  async findAll(
    skip: number = 0,
    limit: number = 10,
    adminId: string
  ): Promise<TasksResponse> {
    const adminObjectId = new ObjectId(adminId);
    const [tasks, total] = await Promise.all([
      this.taskModel
        .find({ createdBy: adminObjectId })
        .skip(skip)
        .limit(limit)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .exec(),
      this.taskModel.countDocuments({ createdBy: adminObjectId }).exec()
    ]);

    const page = Math.floor(skip / limit) + 1;

    return {
      tasks,
      pagination: {
        skip,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(taskId: string, adminId: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOne({ _id: new ObjectId(taskId), createdBy: new ObjectId(adminId) })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async update(
    taskId: string,
    adminId: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskDocument> {
    if (updateTaskDto.assignedTo)
      updateTaskDto.assignedTo = new ObjectId(updateTaskDto.assignedTo);

    const updated = await this.taskModel.findOneAndUpdate(
      { _id: new ObjectId(taskId), createdBy: new ObjectId(adminId) },
      updateTaskDto,
      {
        new: true
      }
    );
    if (!updated) throw new NotFoundException('Task not found');
    return updated;
  }

  async delete(taskId: string, adminId: string): Promise<{ message: string }> {
    const deleted = await this.taskModel.findOneAndDelete({
      _id: new ObjectId(taskId),
      createdBy: new ObjectId(adminId)
    });
    if (!deleted) throw new NotFoundException('Task not found');
    return { message: 'Task deleted successfully' };
  }

  async deleteTasksByUser(userId: string): Promise<void> {
    await this.taskModel.deleteMany({ assignedTo: new ObjectId(userId) });
  }
}
