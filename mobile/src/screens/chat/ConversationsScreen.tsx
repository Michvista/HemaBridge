import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChatBubble,
  Heart,
  Hospital,
  User as UserIcon,
} from '../../components/Icons';

export const ConversationsScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const { conversations, loadConversations, isLoadingChat } = useChat();

  useEffect(() => {
    loadConversations();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'hospital':
        return <Hospital color="#047857" height={18} width={18} />;
      case 'advocate':
        return <UserIcon color="#b45309" height={18} width={18} />;
      default:
        return <Heart color="#be123c" height={18} width={18} />;
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      refreshControl={
        <RefreshControl refreshing={isLoadingChat} onRefresh={loadConversations} />
      }
    >
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-slate-900">
          Messages & Coordination
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Real-time chat between Donors, Patient Advocates, and Hospital Clinical Teams
        </Text>
      </View>

      {conversations.length === 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-100 shadow-sm mt-4">
          <View className="w-14 h-14 rounded-full bg-rose-50 items-center justify-center mb-3">
            <ChatBubble color="#be123c" height={26} width={26} strokeWidth={2} />
          </View>
          <Text className="font-bold text-slate-800 text-base">
            No Active Conversations Yet
          </Text>
          <Text className="text-xs text-slate-500 text-center mt-1 px-4 leading-5">
            Once a blood donation request is accepted or an appointment is scheduled, a secure chat channel will appear here.
          </Text>
        </View>
      ) : (
        conversations.map((item) => (
          <TouchableOpacity
            key={item.otherUser.id}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                otherUserId: item.otherUser.id,
                otherUserName: item.otherUser.name,
                role: item.otherUser.role,
              })
            }
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3 flex-row items-center"
          >
            <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mr-3 relative">
              {getRoleIcon(item.otherUser.role)}
              {item.unreadCount > 0 ? (
                <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 items-center justify-center border-2 border-white">
                  <Text className="text-[10px] font-black text-white">
                    {item.unreadCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="flex-1 mr-2">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-extrabold text-slate-900 text-sm">
                  {item.otherUser.name}
                </Text>
                <Text className="text-[11px] text-slate-400">
                  {formatTime(item.lastMessage?.createdAt)}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                className={`text-xs ${
                  item.unreadCount > 0
                    ? 'font-bold text-slate-900'
                    : 'text-slate-500'
                }`}
              >
                {item.lastMessage?.content || 'Tap to start conversation'}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};
