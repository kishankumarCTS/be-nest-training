import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinPost')
  async handleJoinRoom(
    @MessageBody() postId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `post-${postId}`;
    await client.join(room);
    return { success: true, room };
  }

  @SubscribeMessage('newComment')
  handleMessageToRoom(
    @MessageBody() data: { postId: number; comment: string },
  ) {
    const room = `post-${data.postId}`;
    this.server.to(room).emit('newComment', {
      comment: data.comment,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('leavePost')
  async handleLeaveRoom(
    @MessageBody() postId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`post-${postId}`);
  }

  handleConnection() {}
  handleDisconnect() {}
}
