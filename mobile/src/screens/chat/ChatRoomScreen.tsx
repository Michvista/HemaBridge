import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
  const { activeMessages, loadMessages, sendMessage, isLoadingChat } = useChat();
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

  // Contextual quick prompts tailored to healthcare blood mobilization
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

  const formatMessageTime = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-slate-100"
    >
      {/* Top Participant Sub-Header */}
      <View className="bg-white px-4 py-3 border-b border-slate-200 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center mr-3 border border-rose-100">
            {otherRole === 'hospital' ? (
              <Hospital color="#047857" height={18} width={18} />
            ) : otherRole === 'advocate' ? (
              <UserIcon color="#b45309" height={18} width={18} />
            ) : (
              <Heart color="#be123c" height={18} width={18} />
            )}
          </View>
          <View>
            <Text className="font-extrabold text-slate-900 text-sm">
              {otherUserName}
            </Text>
            <Text className="text-[11px] text-emerald-600 font-bold flex-row items-center">
              ● Active on Hemabridge
            </Text>
          </View>
        </View>

        <View className="bg-slate-100 px-2.5 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-slate-600 uppercase">
            {otherRole}
          </Text>
        </View>
      </View>

      {/* Messages ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {activeMessages.map((msg) => {
          const isMine = msg.sender?.id === user?.id;

          return (
            <View
              key={msg.id}
              className={`mb-3 max-w-[80%] ${
                isMine ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <View
                className={`p-3.5 rounded-2xl ${
                  isMine
                    ? 'bg-rose-700 rounded-br-none shadow-sm'
                    : 'bg-white rounded-bl-none border border-slate-200 shadow-sm'
                }`}
              >
                <Text
                  className={`text-sm leading-5 ${
                    isMine ? 'text-white font-medium' : 'text-slate-900'
                  }`}
                >
                  {msg.content}
                </Text>

                <View className="flex-row items-center justify-end mt-1.5 space-x-1">
                  <Text
                    className={`text-[10px] ${
                      isMine ? 'text-rose-200' : 'text-slate-400'
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </Text>
                  {isMine ? (
                    <Check
                      color={msg.isRead ? '#6ee7b7' : '#fecdd3'}
                      height={12}
                      width={12}
                      strokeWidth={2.5}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Quick Prompts Bar */}
      <View className="bg-slate-50 border-t border-slate-200 px-3 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSend(prompt)}
              className="bg-white border border-slate-300 rounded-full px-3 py-1.5 mr-2 shadow-xs"
            >
              <Text className="text-xs text-slate-700 font-semibold">
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View className="bg-white p-3 border-t border-slate-200 flex-row items-center">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type message..."
          placeholderTextColor="#94a3b8"
          className="flex-1 bg-slate-100 rounded-2xl px-4 py-2.5 text-sm text-slate-900 mr-2 max-h-24"
          multiline
        />
        <TouchableOpacity
          disabled={!inputText.trim()}
          onPress={() => handleSend()}
          className={`w-11 h-11 rounded-full items-center justify-center shadow-sm ${
            inputText.trim() ? 'bg-rose-700' : 'bg-slate-300'
          }`}
        >
          <Send color="#ffffff" height={18} width={18} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
