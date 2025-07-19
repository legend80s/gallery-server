import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { User as UserModel } from 'generated/prisma';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: { name: string }): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getUser(@Req() request: Request): Promise<null | UserModel> {
    this.logger.log(`request.ip: [${request.ip}]`);

    const users = await this.userService.users({ where: { name: request.ip } });
    this.logger.log(`users length: ${users.length}`);

    if (users.length > 1) {
      throw new BadRequestException(
        'More than one user found with the same name (ip)',
      );
    }

    if (users.length === 0) {
      if (!request.ip) {
        throw new BadRequestException('No ip address found in request');
      }

      this.logger.log(
        `No user found, creating new user using ip: [${request.ip}]`,
      );

      return this.userService.createUser({ name: request.ip });
    }

    return users[0];
  }
}
