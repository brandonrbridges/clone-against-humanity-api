// Nest
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

// Socket
import { Server, Socket } from 'socket.io'
import { Game } from './entities/game.entity'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server

  afterInit() {
    console.log('GameGateway initialized')
  }

  async handleConnection(client: Socket) {
    console.log('Client connected: ' + client.id)
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected: ' + client.id)
  }

  @SubscribeMessage('message')
  async handlePing(client: Socket) {
    console.log('Client pinged: ' + client.id)

    client.emit('message', {
      message: 'pong',
    })
  }

  @SubscribeMessage('create_game')
  handleCreateGame(client: Socket, game: Game) {
    this.server.emit('game_created', game)
  }
}
