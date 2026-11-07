import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { UserRole } from '../types';

// Icons
import {
  Heart,
  Hospital,
  User as UserIcon,
  ChatBubble,
  Search,
  Clock,
  Medal,
  Activity,
} from '../components/Icons';

// Screens
import { DonorHomeScreen } from '../screens/donor/DonorHomeScreen';
import { DonorRequestsScreen } from '../screens/donor/DonorRequestsScreen';
import { DonorBadgesScreen } from '../screens/donor/DonorBadgesScreen';

import { AdvocateHomeScreen } from '../screens/advocate/AdvocateHomeScreen';
import { AdvocateRequestsScreen } from '../screens/advocate/AdvocateRequestsScreen';

import { HospitalHomeScreen } from '../screens/hospital/HospitalHomeScreen';
import { HospitalQueueScreen } from '../screens/hospital/HospitalQueueScreen';

import { ConversationsScreen } from '../screens/chat/ConversationsScreen';
import { ChatRoomScreen } from '../screens/chat/ChatRoomScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DonorTabs = () => {
  const { unreadTotal } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#be123c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="DonorHome"
        component={DonorHomeScreen}
        options={{
          tabBarLabel: 'Donor Hub',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DonorRequests"
        component={DonorRequestsScreen}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color, size }) => (
            <Clock color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DonorBadges"
        component={DonorBadgesScreen}
        options={{
          tabBarLabel: 'Honours',
          tabBarIcon: ({ color, size }) => (
            <Medal color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="DonorChat"
        component={ConversationsScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: unreadTotal > 0 ? unreadTotal : undefined,
          tabBarBadgeStyle: { backgroundColor: '#e11d48', fontSize: 10 },
          tabBarIcon: ({ color, size }) => (
            <ChatBubble color={color} height={size} width={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AdvocateTabs = () => {
  const { unreadTotal } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#d97706',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="AdvocateHome"
        component={AdvocateHomeScreen}
        options={{
          tabBarLabel: 'Find Donors',
          tabBarIcon: ({ color, size }) => (
            <Search color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdvocateRequests"
        component={AdvocateRequestsScreen}
        options={{
          tabBarLabel: 'My Requests',
          tabBarIcon: ({ color, size }) => (
            <Clock color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdvocateChat"
        component={ConversationsScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: unreadTotal > 0 ? unreadTotal : undefined,
          tabBarBadgeStyle: { backgroundColor: '#e11d48', fontSize: 10 },
          tabBarIcon: ({ color, size }) => (
            <ChatBubble color={color} height={size} width={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HospitalTabs = () => {
  const { unreadTotal } = useChat();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#047857',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="HospitalHome"
        component={HospitalHomeScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <Hospital color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HospitalQueue"
        component={HospitalQueueScreen}
        options={{
          tabBarLabel: 'Screenings',
          tabBarIcon: ({ color, size }) => (
            <Activity color={color} height={size} width={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HospitalChat"
        component={ConversationsScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarBadge: unreadTotal > 0 ? unreadTotal : undefined,
          tabBarBadgeStyle: { backgroundColor: '#e11d48', fontSize: 10 },
          tabBarIcon: ({ color, size }) => (
            <ChatBubble color={color} height={size} width={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { role } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerTintColor: '#be123c',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {role === UserRole.DONOR ? (
          <Stack.Screen
            name="DonorRoot"
            component={DonorTabs}
            options={{ headerShown: false }}
          />
        ) : role === UserRole.ADVOCATE ? (
          <Stack.Screen
            name="AdvocateRoot"
            component={AdvocateTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="HospitalRoot"
            component={HospitalTabs}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen
          name="ChatRoom"
          component={ChatRoomScreen}
          options={({ route }: any) => ({
            title: route.params?.otherUserName || 'Chat',
            headerStyle: { backgroundColor: '#ffffff' },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
