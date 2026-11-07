import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';
import { Header } from './src/components/Header';
import { RootNavigator } from './src/navigation/RootNavigator';
import { IntroWelcomeScreen } from './src/screens/auth/IntroWelcomeScreen';
import { AuthScreen } from './src/screens/auth/AuthScreen';

const MainNavigator: React.FC = () => {
  const { user, showIntro, setShowIntro } = useAuth();
  const [authView, setAuthView] = useState<'intro' | 'auth'>('intro');

  // If user tapped "Intro Home Page", or logged out, show the Welcome / Auth flows
  if (showIntro || !user) {
    if (authView === 'auth') {
      return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'left', 'right']}>
          <AuthScreen onBackToIntro={() => setAuthView('intro')} />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
        <IntroWelcomeScreen onNavigateToAuth={() => setAuthView('auth')} />
      </SafeAreaView>
    );
  }

  // Active Authenticated / Persona Dashboard
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <Header />
      <RootNavigator />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AuthProvider>
        <ChatProvider>
          <MainNavigator />
        </ChatProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
