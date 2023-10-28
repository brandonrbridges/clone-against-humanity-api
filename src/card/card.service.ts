// Nest
import { Injectable } from '@nestjs/common'

// TypeORM
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

// Entities
import { Card } from './entities/card.entity'

// DTOs
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'

@Injectable()
export class CardService {
  constructor(@InjectRepository(Card) private cardRepo: Repository<Card>) {}

  async create(data: CreateCardDto): Promise<Card> {
    return await this.cardRepo.save(data)
  }

  async findAll(): Promise<Card[]> {
    return await this.cardRepo.find()
  }

  async findAllOfType(type: 'black' | 'white'): Promise<Card[]> {
    return await this.cardRepo.find({ where: { type } })
  }

  async findOne(id: string): Promise<Card> {
    return await this.cardRepo.findOne({ where: { id } })
  }

  update(id: number, data: UpdateCardDto) {
    console.log(data)

    return `This action updates a #${id} card`
  }

  remove(id: number) {
    return `This action removes a #${id} card`
  }

  async generateCard(type: 'black' | 'white'): Promise<Card> {
    const cards = await this.findAllOfType(type)
    const random = Math.floor(Math.random() * cards.length)

    return cards[random]
  }

  async generateHand(type: 'black' | 'white'): Promise<Card[]> {
    const count = type === 'white' ? 5 : 3
    const hand = []

    for (let i = 0; i < count; i++) {
      const card = await this.generateCard(type)

      hand.push(card)
    }

    return hand
  }
}
