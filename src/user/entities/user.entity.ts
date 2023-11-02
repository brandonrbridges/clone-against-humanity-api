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
    nullable: true,
  })
  password: string

  @Column({
    unique: true,
    nullable: true,
  })
  email: string

  @ManyToMany(() => Game, (game) => game.players)
  games: Game[]

  @Column({
    type: 'simple-array',
    enum: ['USER', 'MODERATOR', 'ADMINISTRATOR'],
    default: ['USER'],
    array: true,
    nullable: true,
  })
  roles: string[]

  @CreateDateColumn()
  created_at: Date
}
