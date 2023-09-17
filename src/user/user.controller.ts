// Nest
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
} from '@nestjs/common';

// Services
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('temporary')
  async createTemporaryUser(@Body() body: { username: string }): Promise<any> {
    const isValid = await this.userService.isTemporaryUsernameValid(
      body.username,
    );

    if (!isValid) {
      throw new BadRequestException('Username is already taken');
    }

    return await this.userService.createTemporaryUser(body.username);
  }

  @Delete('temporary')
  async deleteTemporaryUser(@Body() body: { username: string }): Promise<any> {
    await this.userService.deleteTemporaryUser(body.username);

    return {
      message: 'User deleted',
    };
  }
}
