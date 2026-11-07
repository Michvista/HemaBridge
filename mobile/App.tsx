import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import { Header } from './src/components/Header';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthProvider>
        <ChatProvider>
          <SafeAreaView className="flex-1 bg-white">
            <Header />
            <RootNavigator />
          </SafeAreaView>
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
