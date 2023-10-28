// TypeORM
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// Entities
import { Card } from 'src/card/entities/card.entity'

@Entity()
export class GameRound {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  game_id: string

  @Column()
  number: number

  @Column()
  czar_id: string

  @Column('json', {
    nullable: true,
  })
  black_card: SelectedCard

  @Column('json', {
    nullable: true,
  })
  white_cards: SelectedCard[]

  @Column('json', {
    nullable: true,
  })
  winning_card: SelectedCard
}

type SelectedCard = Card & {
  player_id: string
  player_name: string
}
