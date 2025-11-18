import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User, UserDocument } from './schemas/user.schema';

import { UserRole, UserStatus } from 'src/constants/user.constants';

import { UsersResponse } from './interfaces/users.interface';

import { TasksService } from 'src/tasks/tasks.service';

const { ObjectId } = Types;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private taskService: TasksService
  ) {}

  async create(
    createUserDto: CreateUserDto,
    adminId?: string
  ): Promise<UserDocument> {
    const exists = await this.userModel.findOne({ email: createUserDto.email });
    if (exists)
      throw new BadRequestException('Email is already in use by another user');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userModel.create({
      ...createUserDto,
      ...(createUserDto.role === UserRole.USER && adminId
        ? { createdBy: new ObjectId(adminId) }
        : {}),
      password: hashedPassword
    });

    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
  }

  async findAll(adminId: string): Promise<UserDocument[]> {
    return this.userModel
      .find({
        createdBy: new ObjectId(adminId),
        role: UserRole.USER,
        status: UserStatus.ACTIVE
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllPaginated(
    skip: number,
    limit: number,
    adminId: string
  ): Promise<UsersResponse> {
    const [users, total] = await Promise.all([
      this.userModel
        .find({ createdBy: new ObjectId(adminId), role: UserRole.USER })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments({
        createdBy: new ObjectId(adminId),
        role: UserRole.USER
      })
    ]);

    const page = Math.floor(skip / limit) + 1;
    return {
      users,
      pagination: {
        skip,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(userId: string, adminId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: new ObjectId(userId), createdBy: new ObjectId(adminId) })
      .select('-password');

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(
    userId: string,
    adminId: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    const userWithEmailExists = await this.userModel.findOne({
      email: updateUserDto.email,
      _id: { $ne: new ObjectId(userId) }
    });

    if (userWithEmailExists)
      throw new BadRequestException('Email is already in use by another user');

    const user = await this.userModel
      .findOneAndUpdate(
        { _id: new ObjectId(userId), createdBy: new ObjectId(adminId) },
        updateUserDto,
        { new: true }
      )
      .select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(userId: string, adminId: string): Promise<void> {
    const result = await this.userModel.findOneAndDelete({
      _id: new ObjectId(userId),
      createdBy: new ObjectId(adminId)
    });
    if (!result) throw new NotFoundException('User not found');
    await this.taskService.deleteTasksByUser(userId);
  }

  // --- used by AuthService ---
  async findSelectedUserField(
    query: any,
    field: string
  ): Promise<UserDocument> {
    return this.userModel.findOne(query).select(field);
  }

  async findOneByQuery(query: any): Promise<UserDocument> {
    return this.userModel.findOne(query);
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }
}
