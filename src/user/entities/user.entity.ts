// TypeORM
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

// Entities
import { Game } from 'src/game/entities/game.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    unique: true,
  })
  username: string

  @Column({
    default: true,
  })
  temporary: boolean

  @ManyToMany(() => Game, (game) => game.players)
  games: Game[]

  @CreateDateColumn()
  created_at: Date
}
