import { Module } from '@nestjs/common'

// Nest Modules
import { TypeOrmModule } from '@nestjs/typeorm'

// Service
import { GameService } from './game.service'

// Controller
import { GameController } from './game.controller'

// Gateway
import { GameGateway } from './game.gateway'

// Modules
import { CardModule } from 'src/card/card.module'
import { UserModule } from 'src/user/user.module'

// Entities
import { Game } from './entities/game.entity'
import { GameRound } from './entities/round.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameRound]),
    CardModule,
    UserModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
