import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { BloodRequest, RequestStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Heart,
  Hospital,
  Pin,
  Clock,
  ChatBubble,
  Check,
  Cancel,
} from '../../components/Icons';

export const DonorRequestsScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await apiClient.get('/requests/matching');
      setRequests(res.data);
    } catch (err) {
      console.log('Error loading requests:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRespond = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      await apiClient.patch(`/requests/${requestId}/respond`, { action });
      Alert.alert(
        action === 'accept' ? 'Request Accepted' : 'Request Declined',
        action === 'accept'
          ? 'You have connected with the patient advocate. You can now chat in real-time to coordinate arrival.'
          : 'The request has been removed from your active queue.',
      );
      loadRequests();
    } catch (err) {
      Alert.alert('Error', 'Unable to respond to request.');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadRequests();
          }}
        />
      }
    >
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-slate-900">
          Patient Requests
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Distressed patients and families requesting {user?.donorProfile?.bloodType || 'compatible'} blood
        </Text>
      </View>

      {requests.length === 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-100 shadow-sm mt-4">
          <View className="w-14 h-14 rounded-full bg-rose-50 items-center justify-center mb-3">
            <Heart color="#e11d48" height={28} width={28} strokeWidth={2} />
          </View>
          <Text className="font-bold text-slate-800 text-base">
            No Active Requests
          </Text>
          <Text className="text-xs text-slate-500 text-center mt-1 px-4 leading-5">
            You will receive instant notifications whenever a patient advocate or healthcare facility requests your blood type nearby.
          </Text>
        </View>
      ) : (
        requests.map((req) => (
          <View
            key={req.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3.5"
          >
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-xl bg-rose-700 items-center justify-center mr-2.5 shadow-sm">
                  <Text className="text-white font-extrabold text-xs">
                    {req.bloodType}
                  </Text>
                </View>
                <View>
                  <Text className="font-extrabold text-slate-900 text-sm">
                    {req.advocate?.name || 'Patient Advocate'}
                  </Text>
                  <Text className="text-xs text-slate-500">{req.hospitalName}</Text>
                </View>
              </View>

              <StatusBadge status={req.status} />
            </View>

            {req.note ? (
              <View className="bg-slate-50 p-3 rounded-xl my-2 border border-slate-100">
                <Text className="text-xs text-slate-700 italic">"{req.note}"</Text>
              </View>
            ) : null}

            <View className="flex-row items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <View className="flex-row items-center">
                <Pin color="#64748b" height={13} width={13} />
                <Text className="text-xs text-slate-500 ml-1">{req.location}</Text>
              </View>

              {req.status === RequestStatus.PENDING ? (
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => handleRespond(req.id, 'decline')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 mr-2"
                  >
                    <Text className="text-xs font-bold text-slate-600">Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRespond(req.id, 'accept')}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-700 shadow-sm"
                  >
                    <Text className="text-xs font-bold text-white">Accept</Text>
                  </TouchableOpacity>
                </View>
              ) : req.status === RequestStatus.ACCEPTED ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ChatRoom', {
                      otherUserId: req.advocate?.id,
                      otherUserName: req.advocate?.name || 'Patient Advocate',
                      role: 'advocate',
                    })
                  }
                  className="flex-row items-center bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-lg"
                >
                  <ChatBubble color="#be123c" height={14} width={14} strokeWidth={2} />
                  <Text className="text-xs font-bold text-rose-800 ml-1.5">
                    Open Chat
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};
