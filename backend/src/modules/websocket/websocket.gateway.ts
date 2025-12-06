import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-user-room')
  handleJoinUserRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user-${data.userId}`);
    this.logger.log(`User ${data.userId} joined their room`);
    return { event: 'joined-room', data: { room: `user-${data.userId}` } };
  }

  @SubscribeMessage('join-valuation-room')
  handleJoinValuationRoom(
    @MessageBody() data: { jobId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`valuation-${data.jobId}`);
    this.logger.log(`Client joined valuation room: ${data.jobId}`);
    return { event: 'joined-valuation-room', data: { room: `valuation-${data.jobId}` } };
  }

  // Methods to emit events from services
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user-${userId}`).emit(event, data);
  }

  emitValuationUpdate(jobId: string, data: any) {
    this.server.to(`valuation-${jobId}`).emit('valuation-update', data);
  }

  emitLoanUpdate(userId: string, data: any) {
    this.emitToUser(userId, 'loan-update', data);
  }

  emitPortfolioUpdate(userId: string, data: any) {
    this.emitToUser(userId, 'portfolio-update', data);
  }

  emitNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'notification', notification);
  }
}