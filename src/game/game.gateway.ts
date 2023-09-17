// Types
import type { Game } from '@prisma/client';

// Nest
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// Socket
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer() server: Server;

  users: number = 0;

  private gameRooms: Map<string, string[]> = new Map();

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    this.users++;

    this.server.emit('users', this.users);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    const gameId = client.handshake.query.gameId as string;

    if (gameId) {
      this.leaveGameRoom(client, gameId);
    }

    this.users--;

    this.server.emit('users', this.users);
  }

  @SubscribeMessage('gameCreated')
  handleGameCreated(client: Socket, game: Game) {
    this.server.emit('gameCreated', game);
  }

  @SubscribeMessage('gameDeleted')
  handleGameDeleted(client: Socket, game: Game) {
    this.server.emit('gameDeleted', game);
  }

  @SubscribeMessage('gameUpdated')
  handleGameUpdated(client: Socket, game: Game) {
    this.server.emit('gameUpdated', game);
  }

  private joinGameRoom(client: Socket, gameId: string) {
    const clientsInGame = this.gameRooms.get(gameId) || [];

    clientsInGame.push(client.id);

    this.gameRooms.set(gameId, clientsInGame);

    client.join(gameId);
  }

  private leaveGameRoom(client: Socket, gameId: string) {
    const clientsInGame = this.gameRooms.get(gameId) || [];

    const updatedClients = clientsInGame.filter((id) => id !== client.id);

    this.gameRooms.set(gameId, updatedClients);

    client.leave(gameId);
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, gameId: string) {
    console.log(`Client ${client.id} joining game ${gameId}`);

    this.joinGameRoom(client, gameId);
  }

  @SubscribeMessage('leaveGame')
  handleLeaveGame(client: Socket, gameId: string) {
    console.log(`Client ${client.id} leaving game ${gameId}`);

    this.leaveGameRoom(client, gameId);
  }
}
