import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Active sockets mapped by userId
  private userSockets = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log(`WebSocket client disconnected: ${client.id}`);
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data?.userId) {
      this.userSockets.set(data.userId, client.id);
      client.join(`user_${data.userId}`);
      console.log(`User ${data.userId} registered with socket ${client.id}`);
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; otherUserId: string },
  ) {
    const roomId = this.getRoomId(data.userId, data.otherUserId);
    client.join(roomId);
    console.log(`Socket ${client.id} joined conversation room: ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      content: string;
      requestId?: string;
      applicationId?: string;
    },
  ) {
    const savedMessage = await this.chatService.saveMessage(
      data.senderId,
      data.receiverId,
      data.content,
      data.requestId,
      data.applicationId,
    );

    const roomId = this.getRoomId(data.senderId, data.receiverId);

    // Broadcast to room
    this.server.to(roomId).emit('newMessage', savedMessage);

    // Also notify receiver's personal user channel if they are outside the room
    this.server.to(`user_${data.receiverId}`).emit('chatNotification', {
      senderId: data.senderId,
      message: savedMessage,
    });

    return savedMessage;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      isTyping: boolean;
    },
  ) {
    const roomId = this.getRoomId(data.senderId, data.receiverId);
    client.to(roomId).emit('userTyping', {
      senderId: data.senderId,
      isTyping: data.isTyping,
    });
  }

  private getRoomId(userA: string, userB: string): string {
    const sorted = [userA, userB].sort();
    return `chat_${sorted[0]}_${sorted[1]}`;
  }
}
