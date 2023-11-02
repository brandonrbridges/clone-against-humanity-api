// Nest
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

// TypeORM
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

// Service
import { CardService } from 'src/card/card.service'
import { UserService } from 'src/user/user.service'

// Gateway
import { GameGateway } from './game.gateway'

// Entities
import { Game } from './entities/game.entity'
import { GameRound } from './entities/round.entity'

// DTOs
import { CreateGameDto } from './dto/create-game.dto'
import { JoinGameDto } from './dto/join-game.dto'
import { LeaveGameDto } from './dto/leave-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(GameRound) private roundRepo: Repository<GameRound>,

    private readonly gameGateway: GameGateway,

    private readonly cardService: CardService,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateGameDto): Promise<Game> {
    const game = await this.gameRepo.save(data)

    this.gameGateway.server.emit('game_created', game)

    return game
  }

  async findAll(): Promise<Game[]> {
    const games = await this.gameRepo.find({ relations: ['players', 'rounds'] })

    return games
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { id },
      relations: ['players', 'rounds'],
    })

    return game
  }

  async update(id: string, data: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new Error('Game not found')
    }

    await this.gameRepo.update(id, data)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async playerJoin(id: string, data: JoinGameDto): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    if (game?.players?.length >= game.max_players) {
      throw new BadRequestException('Game is full')
    }

    const player = await this.userService.findOne(data.player_id)

    game.players.push(player)

    await this.gameRepo.save(game)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async playerLeave(id: string, data: LeaveGameDto) {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    const player = await this.userService.findOne(data.player_id)

    game.players = game.players.filter((p) => p.id !== player.id)

    await this.gameRepo.save(game)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async startGame(id: string, data: { player_id: string }): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    if (game.players.length < 2) {
      throw new BadRequestException('Not enough players')
    }

    if (game.host !== data.player_id) {
      throw new BadRequestException('You are not the host')
    }

    const round = await this.roundRepo.save({
      game_id: game.id,
      number: 1,
      czar_id: game.players[0].id,
    })

    game.rounds.push(round)

    await this.gameRepo.save(game)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async selectBlackCard(
    id: string,
    data: {
      player_id: string
      card_id: string
    },
  ): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    const round = game.rounds[game.rounds.length - 1]

    if (round.czar_id !== data.player_id) {
      throw new BadRequestException('You are not the czar')
    }

    const card = await this.cardService.findOne(data.card_id)
    const player = await this.userService.findOne(data.player_id)

    round.black_card = {
      ...card,
      player_id: player.id,
      player_name: player.username,
    }

    await this.roundRepo.save(round)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async selectWhiteCard(
    id: string,
    data: {
      player_id: string
      card_id: string
    },
  ): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    const round = game.rounds[game.rounds.length - 1]

    if (round.czar_id === data.player_id) {
      throw new BadRequestException('You are the czar')
    }

    const card = await this.cardService.findOne(data.card_id)
    const player = await this.userService.findOne(data.player_id)

    const cards = round.white_cards || []

    cards.push({
      ...card,
      player_id: player.id,
      player_name: player.username,
    })

    round.white_cards = cards

    await this.roundRepo.save(round)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async selectWinningCard(id: string, card_id: string): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    const round = game.rounds[game.rounds.length - 1]

    const card = round.white_cards.find((c) => c.id === card_id)

    round.winning_card = {
      ...card,
    }

    await this.roundRepo.save(round)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async startNewRound(id: string): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    const round = game.rounds[game.rounds.length - 1]

    const czarIndex = game.players.findIndex((p) => p.id === round.czar_id)

    const nextCzarIndex =
      czarIndex + 1 >= game.players.length ? 0 : czarIndex + 1

    const nextCzar = game.players[nextCzarIndex]

    const newRound = await this.roundRepo.save({
      game_id: game.id,
      number: round.number + 1,
      czar_id: nextCzar.id,
    })

    game.rounds.push(newRound)

    await this.gameRepo.save(game)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async endGame(id: string): Promise<Game> {
    const game = await this.findOne(id)

    if (!game) {
      throw new NotFoundException('Game not found')
    }

    // calculate winner
    const scoreMap = new Map<string, number>()

    for (const round of game.rounds) {
      if (round.winning_card) {
        const winnerId = round.winning_card.player_id
        const currentScore = scoreMap.get(winnerId) || 0

        scoreMap.set(winnerId, currentScore + 1)
      }
    }

    let topScore = 0
    let winnerId = ''

    for (const [playerId, score] of scoreMap) {
      if (score > topScore) {
        topScore = score
        winnerId = playerId
      }
    }

    game.winner = winnerId

    await this.gameRepo.save(game)

    this.gameGateway.server.emit('game_updated', game)

    return game
  }

  async remove(id: string): Promise<void> {
    await this.gameRepo.delete(id)

    return
  }
}
