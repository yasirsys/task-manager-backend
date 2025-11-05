import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Task, TaskDocument } from 'src/tasks/schemas/task.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { TaskStatus } from 'src/constants/task.constants';
import { UserStatus } from 'src/constants/user.constants';

const { ObjectId } = Types;
@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async getCardsStatistics(adminId: string) {
    const [
      totalTasks = 0,
      totalCompletedTasks = 0,
      totalInProgressTasks = 0,
      totalUsers = 0,
      totalActiveUsers = 0
    ] = await Promise.all([
      this.taskModel.countDocuments({ createdBy: new ObjectId(adminId) }),
      this.taskModel.countDocuments({
        createdBy: new ObjectId(adminId),
        status: TaskStatus.COMPLETED
      }),
      this.taskModel.countDocuments({
        createdBy: new ObjectId(adminId),
        status: TaskStatus.IN_PROGRESS
      }),
      this.userModel.countDocuments({ createdBy: new ObjectId(adminId) }),
      this.userModel.countDocuments({
        createdBy: new ObjectId(adminId),
        status: UserStatus.ACTIVE
      })
    ]);

    const taskCompletionPercentage = !totalTasks
      ? 0
      : Number(((totalCompletedTasks / totalTasks) * 100).toFixed(2));

    return {
      totalTasks,
      totalCompletedTasks,
      totalInProgressTasks,
      totalUsers,
      totalActiveUsers,
      taskCompletionPercentage
    };
  }

  async getTaskAnalytics(adminId: string) {
    const [latestTasks, statusDistribution] = await Promise.all([
      this.taskModel
        .find({ createdBy: new ObjectId(adminId) })
        .sort({ createdAt: -1 })
        .populate('assignedTo', 'name email')
        .limit(3),
      this.taskModel.aggregate([
        { $match: { createdBy: new ObjectId(adminId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Map distribution counts
    const distribution = {
      pending: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0
    };

    for (const item of statusDistribution) {
      distribution[item._id] = item.count;
    }

    return {
      latestTasks,
      taskDistribution: distribution
    };
  }
}
