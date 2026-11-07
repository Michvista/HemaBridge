import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { apiClient } from '../../api/client';
import { BloodRequest, RequestStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Heart,
  Hospital,
  Pin,
  Clock,
  ChatBubble,
  WarningTriangle,
} from '../../components/Icons';

export const AdvocateRequestsScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCancelId, setSelectedCancelId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await apiClient.get('/requests/my-requests');
      setRequests(res.data);
    } catch (err) {
      console.log('Error loading advocate requests:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedCancelId) return;
    try {
      await apiClient.patch(`/requests/${selectedCancelId}/cancel`);
      setSelectedCancelId(null);
      Alert.alert('Request Cancelled', 'The blood request has been closed.');
      loadRequests();
    } catch (err) {
      Alert.alert('Error', 'Unable to cancel request.');
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
          My Blood Requests
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Track donor responses, connection updates, and clinical handoffs
        </Text>
      </View>

      {requests.length === 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-100 shadow-sm mt-4">
          <Text className="font-bold text-slate-800 text-base">
            No Requests Created
          </Text>
          <Text className="text-xs text-slate-500 text-center mt-1 px-4 leading-5">
            Use the "Find Donors" tab to broadcast an emergency blood request or request to connect with screened donors.
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
                    {req.matchedDonor
                      ? req.matchedDonor.name
                      : 'Awaiting Donor Match'}
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

              <View className="flex-row items-center space-x-2">
                {req.status === RequestStatus.ACCEPTED && req.matchedDonor ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ChatRoom', {
                        otherUserId: req.matchedDonor?.id,
                        otherUserName: req.matchedDonor?.name || 'Matched Donor',
                        role: 'donor',
                      })
                    }
                    className="flex-row items-center bg-rose-700 px-3.5 py-1.5 rounded-lg shadow-sm mr-2"
                  >
                    <ChatBubble color="#ffffff" height={14} width={14} strokeWidth={2} />
                    <Text className="text-xs font-bold text-white ml-1.5">
                      Chat with Donor
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {req.status === RequestStatus.PENDING ? (
                  <TouchableOpacity
                    onPress={() => setSelectedCancelId(req.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <Text className="text-xs font-bold text-slate-600">Cancel</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        ))
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={!!selectedCancelId}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCancelId(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <Text className="text-lg font-bold text-slate-900 mb-2">
              Confirm Request Cancellation
            </Text>
            <Text className="text-xs text-slate-500 mb-5 leading-5">
              Are you sure you want to cancel this emergency request? Any notified donors will no longer be prompted for this case.
            </Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setSelectedCancelId(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 items-center justify-center mr-2"
              >
                <Text className="font-bold text-slate-700 text-sm">Dismiss</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelRequest}
                className="flex-1 py-3 rounded-xl bg-rose-700 items-center justify-center shadow-md ml-2"
              >
                <Text className="font-bold text-white text-sm">
                  Yes, Cancel Request
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
