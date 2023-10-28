import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    enum: ['white', 'black'],
  })
  type: string

  @Column()
  text: string

  @Column({
    default: null,
    nullable: true,
  })
  gap_count?: number
}
