// Nest
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'

// Service
import { CardService } from './card.service'

// DTOs
import { CreateCardDto } from './dto/create-card.dto'
import { UpdateCardDto } from './dto/update-card.dto'

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@Body() data: CreateCardDto) {
    return this.cardService.create(data)
  }

  @Get('white')
  async getWhiteCard() {
    return await this.cardService.generateCard('white')
  }

  @Get('white/hand')
  async getWhiteHand() {
    return await this.cardService.generateHand('white')
  }

  @Get('black/hand')
  async getBlackHand() {
    return await this.cardService.generateHand('black')
  }

  @Get()
  findAll() {
    return this.cardService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCardDto) {
    return this.cardService.update(+id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id)
  }
}
