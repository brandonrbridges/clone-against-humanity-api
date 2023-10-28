// Nest
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common'

// Service
import { GameService } from './game.service'

// DTOs
import { CreateGameDto } from './dto/create-game.dto'
import { JoinGameDto } from './dto/join-game.dto'
import { LeaveGameDto } from './dto/leave-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() data: CreateGameDto) {
    return this.gameService.create(data)
  }

  @Get()
  findAll() {
    return this.gameService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateGameDto) {
    return this.gameService.update(id, data)
  }

  @Put(':id/join')
  updateJoin(@Param('id') id: string, @Body() data: JoinGameDto) {
    return this.gameService.playerJoin(id, data)
  }

  @Put(':id/leave')
  updateLeave(@Param('id') id: string, @Body() data: LeaveGameDto) {
    return this.gameService.playerLeave(id, data)
  }

  @Put(':id/start')
  updateStart(@Param('id') id: string, @Body() data: { player_id: string }) {
    return this.gameService.startGame(id, data)
  }

  @Put(':id/select-black-card')
  updateSelectBlackCard(
    @Param('id') id: string,
    @Body() data: { player_id: string; card_id: string },
  ) {
    return this.gameService.selectBlackCard(id, data)
  }

  @Put(':id/select-white-card')
  updateSelectWhiteCard(
    @Param('id') id: string,
    @Body() data: { player_id: string; card_id: string },
  ) {
    return this.gameService.selectWhiteCard(id, data)
  }

  @Put(':id/select-winning-card')
  async updateSelectWinningCard(
    @Param('id') id: string,
    @Body() data: { card_id: string },
  ) {
    const game = await this.gameService.selectWinningCard(id, data.card_id)

    await new Promise((resolve) => setTimeout(resolve, 5000))

    if (game.rounds.length >= game.max_rounds) {
      return await this.gameService.endGame(id)
    } else {
      return await this.gameService.startNewRound(id)
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id)
  }
}
