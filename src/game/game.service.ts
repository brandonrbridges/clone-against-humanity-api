// Types
import type { Game } from '@prisma/client';

// Nest
import { Injectable } from '@nestjs/common';

// Prisma
import { PrismaService } from 'src/prisma/prisma.service';

// Gateways
import { GameGateway } from './game.gateway';

// Dtos
import { CreateGameDto } from './dtos/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameGateway: GameGateway,
  ) {}

  async getAllGames(): Promise<Game[]> {
    return await this.prisma.client.game.findMany({
      include: {
        players: true,
      },
    });
  }

  async getGame(id: string): Promise<Game> {
    const game = await this.prisma.client.game.findUnique({
      where: {
        id: id,
      },
      include: {
        players: true,
      },
    });

    return game;
  }

  async createGame(data: CreateGameDto, ipAddress: string): Promise<Game> {
    const player = await this.prisma.client.player.create({
      data: {
        username: data.user.username,
        ipAddress: ipAddress,
        host: true,
        game: {
          create: {
            name: data.name,
            inviteCode: data.inviteCode,
            rounds: data.rounds,
            maxPlayers: data.maxPlayers,
          },
        },
      },
      include: {
        game: {
          include: {
            players: true,
          },
        },
      },
    });

    this.gameGateway.server.emit('gameCreated', player.game);

    return player.game;
  }

  async leaveGame(gameId: string, username: string): Promise<Game> {
    const game = await this.prisma.client.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        players: true,
      },
    });

    const player = game.players.find((player) => player.username === username);

    if (player.host) {
      await this.prisma.client.game.delete({
        where: {
          id: gameId,
        },
      });

      this.gameGateway.server.emit('gameDeleted', gameId);
    } else {
      await this.prisma.client.player.update({
        where: {
          id: player.id,
        },
        data: {
          connected: false,
        },
      });

      this.gameGateway.server.emit('gameUpdated', game);
      this.gameGateway.server.to(gameId).emit('playerLeft', player);
    }

    return game;
  }

  async joinGame(
    gameId: string,
    username: string,
    ipAddress: string,
  ): Promise<Game> {
    let game = await this.prisma.client.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        players: true,
      },
    });

    let player = game.players.find((player) => player.username === username);

    if (player) {
      await this.prisma.client.player.update({
        where: {
          id: player.id,
        },
        data: {
          connected: true,
        },
      });
    } else {
      const user = await this.prisma.client.user.findUnique({
        where: {
          username: username,
        },
      });

      player = await this.prisma.client.player.create({
        data: {
          username: user.username,
          email: user.email,
          ipAddress: ipAddress,
          game: {
            connect: {
              id: gameId,
            },
          },
        },
      });
    }

    this.gameGateway.server.emit('gameUpdated', game);
    this.gameGateway.server.to(gameId).emit('playerJoined', player);

    return game;
  }
}
