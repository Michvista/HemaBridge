import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ConversationThread } from '../types';
import { apiClient } from '../api/client';
import { getSocket } from '../api/socket';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: ConversationThread[];
  activeMessages: ChatMessage[];
  unreadTotal: number;
  isLoadingChat: boolean;
  loadConversations: () => Promise<void>;
  loadMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (
    receiverId: string,
    content: string,
    requestId?: string,
    applicationId?: string,
  ) => Promise<void>;
  markAsRead: (otherUserId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [activeOtherUserId, setActiveOtherUserId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  const unreadTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!user?.id || !token) return;

    const socket = getSocket(user.id);

    const handleNewMessage = (msg: ChatMessage) => {
      // If we are currently in this conversation, append message
      if (
        activeOtherUserId &&
        (msg.sender.id === activeOtherUserId || msg.receiver.id === activeOtherUserId)
      ) {
        setActiveMessages((prev) => [...prev, msg]);
        markAsRead(activeOtherUserId);
      }
      loadConversations();
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('chatNotification', () => {
      loadConversations();
    });

    loadConversations();

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('chatNotification');
    };
  }, [user?.id, token, activeOtherUserId]);

  const loadConversations = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/chat/conversations');
      setConversations(res.data);
    } catch (err) {
      console.log('Error loading conversations:', err);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    setIsLoadingChat(true);
    setActiveOtherUserId(otherUserId);
    try {
      const res = await apiClient.get(`/chat/messages/${otherUserId}`);
      setActiveMessages(res.data);

      if (user?.id) {
        const socket = getSocket(user.id);
        socket.emit('joinConversation', {
          userId: user.id,
          otherUserId,
        });
      }

      await markAsRead(otherUserId);
    } catch (err) {
      console.log('Error loading messages:', err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const sendMessage = async (
    receiverId: string,
    content: string,
    requestId?: string,
    applicationId?: string,
  ) => {
    if (!user?.id) return;

    const socket = getSocket(user.id);
    const payload = {
      senderId: user.id,
      receiverId,
      content,
      requestId,
      applicationId,
    };

    // Emit via WebSocket for instant low-latency delivery
    socket.emit('sendMessage', payload, (ackMessage: ChatMessage) => {
      if (ackMessage) {
        setActiveMessages((prev) => [...prev, ackMessage]);
      }
    });

    // Also fallback to REST if needed
    try {
      const res = await apiClient.post('/chat/send', {
        receiverId,
        content,
        requestId,
        applicationId,
      });
      if (!activeMessages.some((m) => m.id === res.data.id)) {
        setActiveMessages((prev) => [...prev, res.data]);
      }
      loadConversations();
    } catch (err) {
      console.log('Error sending message via REST fallback:', err);
    }
  };

  const markAsRead = async (otherUserId: string) => {
    try {
      await apiClient.patch(`/chat/read/${otherUserId}`);
      setConversations((prev) =>
        prev.map((c) =>
          c.otherUser.id === otherUserId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    } catch (err) {
      console.log('Error marking as read:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeMessages,
        unreadTotal,
        isLoadingChat,
        loadConversations,
        loadMessages,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
