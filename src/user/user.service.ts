// Nest
import { Injectable } from '@nestjs/common';

// Prisma
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemporaryUser(username: string): Promise<any> {
    return await this.prisma.client.user.create({
      data: {
        username,
      },
    });
  }

  async deleteTemporaryUser(username: string): Promise<any> {
    const user = await this.getUserByUsername(username);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    return await this.prisma.client.user.delete({
      where: {
        username,
      },
    });
  }

  async getUserByUsername(username: string): Promise<any> {
    return await this.prisma.client.user.findUnique({
      where: {
        username,
      },
    });
  }

  async getAllUsernames(): Promise<string[]> {
    const users = await this.prisma.client.user.findMany();

    return users.map((user) => user.username);
  }

  async isTemporaryUsernameValid(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);

    return !user;
  }
}
