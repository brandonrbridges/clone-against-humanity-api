// Nest
import { Module } from '@nestjs/common'

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm'

// Service
import { CardService } from './card.service'

// Controller
import { CardController } from './card.controller'

// Entities
import { Card } from './entities/card.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
