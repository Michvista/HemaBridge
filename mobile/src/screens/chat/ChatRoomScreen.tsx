import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Send, Check, Clock, Heart, Hospital, User as UserIcon } from '../../components/Icons';

export const ChatRoomScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { otherUserId, otherUserName, role: otherRole } = route.params;
  const { user } = useAuth();
  const { activeMessages, loadMessages, sendMessage, isLoadingChat, clearAllMessages } = useChat();
  const [inputText, setInputText] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages(otherUserId);
  }, [otherUserId]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [activeMessages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    setInputText('');
    await sendMessage(otherUserId, text.trim());
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear chat messages and start over?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAllMessages();
          },
        },
      ],
    );
  };

  // Healthcare quick prompts
  const quickPrompts =
    user?.role === 'donor'
      ? [
          "I'm on my way, ETA 20 mins",
          'I have arrived at the hospital entrance',
          'Which department should I report to?',
        ]
      : user?.role === 'hospital'
      ? [
          'Please report to Haematology Lab, 2nd floor',
          'Drink plenty of water before your blood draw',
          'Your screening tests are fully clear. Thank you!',
        ]
      : [
          'Thank you so much! Patient is currently in Ward 3',
          'The clinical team is waiting for replacement donation',
          'God bless you for stepping up to help our family!',
        ];

  const formatMessageTime = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageDateLabel = (isoString?: string) => {
    if (!isoString) return 'Today';
    const msgDate = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return msgDate.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Group messages with date dividers
  let lastDateLabel = '';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-50"
    >
      {/* Participant Sub-Header */}
      <View className="bg-white px-4 py-3 border-b border-slate-200 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-10 h-10 rounded-2xl bg-rose-50 items-center justify-center mr-3 border border-rose-100">
            {otherRole === 'hospital' ? (
              <Hospital color="#047857" height={18} width={18} />
            ) : otherRole === 'advocate' ? (
              <UserIcon color="#b45309" height={18} width={18} />
            ) : (
              <Heart color="#990011" height={18} width={18} />
            )}
          </View>
          <View className="flex-1">
            <Text className="font-black text-slate-900 text-sm" numberOfLines={1}>
              {otherUserName}
            </Text>
            <Text className="text-[10px] text-emerald-600 font-bold">
              ● Active on Hemabridge
            </Text>
          </View>
        </View>

        {/* Clear Messages CTA */}
        <TouchableOpacity
          onPress={handleClearHistory}
          className="bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl mr-2"
        >
          <Text className="text-[10px] font-bold text-slate-600">Clear</Text>
        </TouchableOpacity>

        <View className="bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
          <Text className="text-[10px] font-black text-[#990011] uppercase">
            {otherRole}
          </Text>
        </View>
      </View>

      {/* Messages ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {activeMessages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-12">
            <View className="w-12 h-12 rounded-2xl bg-rose-50 items-center justify-center mb-2 border border-rose-100">
              <Heart color="#990011" width={22} height={22} strokeWidth={2} />
            </View>
            <Text className="text-sm font-black text-slate-800">
              Emergency Lifeline Chat
            </Text>
            <Text className="text-xs text-slate-500 text-center max-w-xs mt-1">
              Communicate securely regarding blood compatibility, clinical arrival, and donation schedules.
            </Text>
          </View>
        ) : (
          activeMessages.map((msg, index) => {
            const isMine = msg.sender?.id === user?.id;
            const dateLabel = getMessageDateLabel(msg.createdAt);
            const showDateHeader = dateLabel !== lastDateLabel;
            lastDateLabel = dateLabel;

            return (
              <React.Fragment key={msg.id || `msg-${index}`}>
                {showDateHeader && (
                  <View className="items-center my-3">
                    <View className="bg-slate-200/80 px-3 py-1 rounded-full">
                      <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {dateLabel}
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  className={`mb-2.5 max-w-[82%] ${
                    isMine ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <View
                    className={`p-3.5 rounded-2xl ${
                      isMine
                        ? 'bg-[#990011] rounded-br-none shadow-sm'
                        : 'bg-white rounded-bl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    <Text
                      className={`text-xs leading-5 ${
                        isMine ? 'text-white font-medium' : 'text-slate-900'
                      }`}
                    >
                      {msg.content}
                    </Text>

                    <View className="flex-row items-center justify-end mt-1 space-x-1">
                      <Text
                        className={`text-[9px] ${
                          isMine ? 'text-rose-200' : 'text-slate-400'
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </Text>
                      {isMine ? (
                        <Check
                          color={msg.isRead ? '#6ee7b7' : '#fecdd3'}
                          height={11}
                          width={11}
                          strokeWidth={2.5}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </React.Fragment>
            );
          })
        )}
      </ScrollView>

      {/* Quick Prompts Bar */}
      <View className="bg-white border-t border-slate-100 py-2 px-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSend(prompt)}
              className="bg-slate-100 border border-slate-200 rounded-full py-1.5 px-3 mr-2"
            >
              <Text className="text-[11px] text-slate-700 font-semibold">
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View className="bg-white px-3 py-2.5 border-t border-slate-200 flex-row items-center">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type an emergency message..."
          placeholderTextColor="#94a3b8"
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 mr-2 max-h-24"
          multiline
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-2xl items-center justify-center ${
            inputText.trim() ? 'bg-[#990011] shadow' : 'bg-slate-200'
          }`}
        >
          <Send
            color={inputText.trim() ? '#ffffff' : '#94a3b8'}
            height={16}
            width={16}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
