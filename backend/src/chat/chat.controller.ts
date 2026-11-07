import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('conversations')
  async getConversations(@Request() req: any) {
    return this.chatService.getConversationsList(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('messages/:otherUserId')
  async getMessages(
    @Request() req: any,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getConversationMessages(req.user.id, otherUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  async sendMessage(
    @Request() req: any,
    @Body()
    body: {
      receiverId: string;
      content: string;
      requestId?: string;
      applicationId?: string;
    },
  ) {
    return this.chatService.saveMessage(
      req.user.id,
      body.receiverId,
      body.content,
      body.requestId,
      body.applicationId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('read/:otherUserId')
  async markRead(@Request() req: any, @Param('otherUserId') otherUserId: string) {
    return this.chatService.markAsRead(req.user.id, otherUserId);
  }

  @Post('clear-all')
  async clearMessages() {
    return this.chatService.clearAllMessages();
  }
}
