// Types
import type { Game } from '@prisma/client';

// Nest
import { Body, Controller, Get, Post, Req } from '@nestjs/common';

// Express
import { Request } from 'express';

// Services
import { GameService } from './game.service';

// Dtos
import { CreateGameDto } from './dtos/create-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getAllGames(): Promise<Game[]> {
    return await this.gameService.getAllGames();
  }

  @Get(':id')
  async getGame(@Req() request: Request): Promise<Game> {
    return await this.gameService.getGame(request.params.id);
  }

  @Post('create')
  async createGame(
    @Body() data: CreateGameDto,
    @Req() request: Request,
  ): Promise<Game> {
    return await this.gameService.createGame(
      data,
      request.socket.remoteAddress,
    );
  }

  @Post(':id/join')
  async joinGame(
    @Req() request: Request,
    @Body('username') username: string,
  ): Promise<Game> {
    return await this.gameService.joinGame(
      request.params.id,
      username,
      request.socket.remoteAddress,
    );
  }

  @Post(':id/leave')
  async leaveGame(
    @Req() request: Request,
    @Body('username') username: string,
  ): Promise<Game> {
    return await this.gameService.leaveGame(request.params.id, username);
  }
}
