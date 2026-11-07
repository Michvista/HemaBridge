import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
    requestId?: string,
    applicationId?: string,
  ) {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
      relations: ['donorProfile', 'hospitalProfile'],
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
      relations: ['donorProfile', 'hospitalProfile'],
    });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or Receiver not found');
    }

    const message = this.chatMessageRepository.create({
      sender,
      receiver,
      content,
      requestId,
      applicationId,
      isRead: false,
    });

    return this.chatMessageRepository.save(message);
  }

  async getConversationMessages(userId: string, otherUserId: string) {
    return this.chatMessageRepository.find({
      where: [
        { sender: { id: userId }, receiver: { id: otherUserId } },
        { sender: { id: otherUserId }, receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  async getConversationsList(userId: string) {
    // Find all messages involving this user
    const messages = await this.chatMessageRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: [
        'sender',
        'receiver',
        'sender.donorProfile',
        'receiver.donorProfile',
        'sender.hospitalProfile',
        'receiver.hospitalProfile',
      ],
      order: { createdAt: 'DESC' },
    });

    const conversationsMap = new Map<string, any>();

    for (const msg of messages) {
      const otherUser = msg.sender.id === userId ? msg.receiver : msg.sender;
      if (!otherUser) continue;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
            phone: otherUser.phone,
            bloodType: otherUser.donorProfile?.bloodType || null,
            hospitalName: otherUser.hospitalProfile?.name || null,
          },
          lastMessage: {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.sender.id,
          },
          unreadCount: 0,
        });
      }

      if (msg.receiver.id === userId && !msg.isRead) {
        const item = conversationsMap.get(otherUser.id);
        item.unreadCount += 1;
      }
    }

    return Array.from(conversationsMap.values());
  }

  async markAsRead(userId: string, otherUserId: string) {
    await this.chatMessageRepository
      .createQueryBuilder()
      .update(ChatMessage)
      .set({ isRead: true })
      .where('receiverId = :userId AND senderId = :otherUserId AND isRead = false', {
        userId,
        otherUserId,
      })
      .execute();

    return { success: true };
  }

  async clearAllMessages() {
    await this.chatMessageRepository.delete({});
    return { success: true, message: 'All chat messages cleared successfully' };
  }
}
