import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from '../schemas/task.schema';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true }) // Enable CORS if frontend is separate
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(TaskGateway.name);

  taskCreated(task: Task) {
    this.server.emit('taskCreated', task);
  }

  taskUpdated(task: Task) {
    this.server.emit('taskUpdated', task);
  }

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }
}
