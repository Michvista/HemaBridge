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
  clearAllMessages: () => Promise<void>;
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

  // Setup WebSocket listeners with strict deduplication
  useEffect(() => {
    if (!user?.id || !token) return;

    const socket = getSocket(user.id);

    const handleNewMessage = (msg: ChatMessage) => {
      // If we are currently chatting with this user, append only if not already present
      if (
        activeOtherUserId &&
        (msg.sender?.id === activeOtherUserId || msg.receiver?.id === activeOtherUserId)
      ) {
        setActiveMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [...prev, msg];
        });
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
      // Deduplicate fetched messages
      const uniqueMessages: ChatMessage[] = [];
      const seenIds = new Set<string>();
      for (const m of res.data) {
        if (!seenIds.has(m.id)) {
          seenIds.add(m.id);
          uniqueMessages.push(m);
        }
      }
      setActiveMessages(uniqueMessages);

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
    if (!user?.id || !content.trim()) return;

    // Send via REST endpoint for guaranteed persistence and single emission
    try {
      const res = await apiClient.post('/chat/send', {
        receiverId,
        content: content.trim(),
        requestId,
        applicationId,
      });

      const savedMessage = res.data;
      if (savedMessage && savedMessage.id) {
        setActiveMessages((prev) => {
          if (prev.some((m) => m.id === savedMessage.id)) {
            return prev;
          }
          return [...prev, savedMessage];
        });
      }
      loadConversations();
    } catch (err) {
      console.log('Error sending message via REST:', err);
      // Fallback local append for immediate responsive feel if offline
      const tempMsg: ChatMessage = {
        id: `local-${Date.now()}-${Math.random()}`,
        content: content.trim(),
        sender: user,
        receiver: { id: receiverId } as any,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setActiveMessages((prev) => [...prev, tempMsg]);
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

  const clearAllMessages = async () => {
    try {
      await apiClient.post('/chat/clear-all');
      setActiveMessages([]);
      setConversations([]);
    } catch (err) {
      console.log('Error clearing messages:', err);
      setActiveMessages([]);
      setConversations([]);
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
        clearAllMessages,
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
