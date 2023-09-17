// Nest
import { Module } from '@nestjs/common';

// Controllers
import { GameController } from './game.controller';

// Services
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';

// Gateways
import { GameGateway } from './game.gateway';

@Module({
  providers: [GameGateway, GameService, PrismaService],
  controllers: [GameController],
})
export class GameModule {}
