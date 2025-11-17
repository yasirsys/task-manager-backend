import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { UserDocument } from '../users/schemas/user.schema';
import { TokenResponse } from './interfaces/auth.interface';

import { SignupDto } from './dto/signup.dto';
import { UserRole } from 'src/constants/user.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findSelectedUserField(
      { email },
      'password'
    );

    if (!user) throw new BadRequestException('Email or password is incorrect');

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async getProfile(userId: string): Promise<UserDocument> {
    return this.usersService.findById(userId);
  }

  async registerAdmin(registerDto: SignupDto): Promise<TokenResponse> {
    const existing = await this.usersService.findOneByQuery({
      email: registerDto.email
    });

    if (existing) throw new BadRequestException('User already exists');

    const userData = {
      ...registerDto,
      role: UserRole.ADMIN
    };

    const user = await this.usersService.create(userData);

    const token = this.generateToken(user);

    return token;
  }

  async login(user: UserDocument): Promise<TokenResponse> {
    const userInfo = await this.usersService.findById(String(user._id));
    if (!userInfo) throw new BadRequestException('User not found');
    if (userInfo.role !== UserRole.ADMIN)
      throw new BadRequestException('Only admins can log in');
    return this.generateToken(userInfo);
  }

  private generateToken(user: UserDocument): TokenResponse {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user
    };
  }
}
