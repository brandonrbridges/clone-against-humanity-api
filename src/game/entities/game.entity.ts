// TypeORM
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

// Entities
import { GameRound } from './round.entity'
import { User } from 'src/user/entities/user.entity'

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  invite_code: string

  @Column()
  host: string

  @Column()
  max_players: number

  @JoinTable()
  @ManyToMany(() => User, (user) => user.games)
  players: User[]

  @Column()
  max_rounds: number

  @JoinTable()
  @ManyToMany(() => GameRound, (round) => round.game_id, {
    nullable: true,
  })
  rounds: GameRound[]

  @Column({
    default: null,
    nullable: true,
  })
  winner?: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
