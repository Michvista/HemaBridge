import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../../api/client';
import { DonorApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Hospital,
  Clock,
  ChatBubble,
  Check,
  Medal,
  Calendar,
} from '../../components/Icons';

export const HospitalQueueScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [queue, setQueue] = useState<DonorApplication[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<DonorApplication | null>(null);
  const [screeningDate, setScreeningDate] = useState<string>('2026-11-12');
  const [screeningTime, setScreeningTime] = useState<string>('10:00');
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState<boolean>(
    false,
  );
  const [awardModalApp, setAwardModalApp] = useState<DonorApplication | null>(
    null,
  );

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const res = await apiClient.get('/applications/hospital-queue');
      setQueue(res.data);
    } catch (err) {
      console.log('Error loading queue:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleScheduleScreening = async () => {
    if (!selectedApp) return;
    try {
      await apiClient.patch(`/applications/${selectedApp.id}/schedule-screening`, {
        screeningDate,
        screeningTime,
      });
      setIsScheduleModalVisible(false);
      Alert.alert(
        'Screening Scheduled',
        `Screening appointment confirmed for ${selectedApp.donor?.name} on ${screeningDate} at ${screeningTime}. Donor has been notified.`,
      );
      loadQueue();
    } catch (err) {
      Alert.alert('Error', 'Unable to schedule screening appointment.');
    }
  };

  const handleCompleteAndAwardBadge = async () => {
    if (!awardModalApp) return;
    try {
      await apiClient.post(`/applications/${awardModalApp.id}/complete`);
      setAwardModalApp(null);
      Alert.alert(
        'Donation Confirmed',
        `Blood collection successfully registered. The "Vein of Hope" badge has been awarded to ${awardModalApp.donor?.name}!`,
      );
      loadQueue();
    } catch (err) {
      Alert.alert('Error', 'Unable to complete donation confirmation.');
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
            loadQueue();
          }}
        />
      }
    >
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-slate-900">
          Donor Screening Queue
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Review voluntary applicants, schedule lab appointments, and award Vein of Hope honours
        </Text>
      </View>

      {queue.length === 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-100 shadow-sm mt-4">
          <Text className="font-bold text-slate-800 text-base">
            No Pending Donor Applications
          </Text>
          <Text className="text-xs text-slate-500 text-center mt-1 px-4 leading-5">
            Applicants who apply via the Hemabridge donor hub will appear here for appointment scheduling.
          </Text>
        </View>
      ) : (
        queue.map((app) => (
          <View
            key={app.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3.5"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-full bg-rose-100 items-center justify-center mr-2.5">
                  <Text className="text-rose-800 font-extrabold text-xs">
                    {app.bloodType}
                  </Text>
                </View>
                <View>
                  <Text className="font-extrabold text-slate-900 text-sm">
                    {app.donor?.name || 'Voluntary Donor'}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {app.donor?.phone || '+234 803 555 0142'}
                  </Text>
                </View>
              </View>

              <StatusBadge status={app.status} />
            </View>

            {app.screeningDate ? (
              <View className="bg-slate-50 p-2.5 rounded-xl my-2 border border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Clock color="#059669" height={13} width={13} />
                  <Text className="text-xs text-slate-700 font-bold ml-1.5">
                    Screening: {app.screeningDate} at {app.screeningTime}
                  </Text>
                </View>
                <Text className="text-[11px] text-emerald-700 font-extrabold">
                  Lab Room 2
                </Text>
              </View>
            ) : null}

            {/* Actions */}
            <View className="flex-row items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    otherUserId: app.donor?.id,
                    otherUserName: app.donor?.name || 'Donor',
                    role: 'donor',
                  })
                }
                className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-lg mr-2"
              >
                <ChatBubble color="#475569" height={13} width={13} strokeWidth={2} />
                <Text className="text-xs font-bold text-slate-700 ml-1.5">
                  Chat
                </Text>
              </TouchableOpacity>

              <View className="flex-row space-x-2">
                {app.status === ApplicationStatus.PENDING ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedApp(app);
                      setIsScheduleModalVisible(true);
                    }}
                    className="bg-emerald-700 px-3.5 py-1.5 rounded-lg shadow-sm"
                  >
                    <Text className="text-xs font-bold text-white">
                      Set Screening
                    </Text>
                  </TouchableOpacity>
                ) : app.status === ApplicationStatus.SCREENING_SCHEDULED ? (
                  <TouchableOpacity
                    onPress={() => setAwardModalApp(app)}
                    className="flex-row items-center bg-amber-600 px-3.5 py-1.5 rounded-lg shadow-sm"
                  >
                    <Medal color="#ffffff" height={13} width={13} strokeWidth={2} />
                    <Text className="text-xs font-bold text-white ml-1.5">
                      Award Badge
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-row items-center bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <Check color="#059669" height={13} width={13} strokeWidth={2.5} />
                    <Text className="text-xs font-bold text-emerald-700 ml-1">
                      Completed & Badged
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))
      )}

      {/* Schedule Screening Modal */}
      <Modal
        visible={isScheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="w-12 h-1 bg-slate-300 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-slate-900 mb-1">
              Schedule Clinical Screening
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Donor: {selectedApp?.donor?.name} (Blood Group: {selectedApp?.bloodType})
            </Text>

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Screening Date (YYYY-MM-DD):
            </Text>
            <TextInput
              value={screeningDate}
              onChangeText={setScreeningDate}
              placeholder="e.g. 2026-11-12"
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs text-slate-900"
            />

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Screening Time (HH:MM):
            </Text>
            <TextInput
              value={screeningTime}
              onChangeText={setScreeningTime}
              placeholder="e.g. 10:30"
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs text-slate-900"
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsScheduleModalVisible(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 items-center justify-center mr-2"
              >
                <Text className="font-bold text-slate-700 text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleScheduleScreening}
                className="flex-1 py-3 rounded-xl bg-emerald-700 items-center justify-center shadow-md ml-2"
              >
                <Text className="font-bold text-white text-sm">
                  Confirm Appointment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Award Badge Modal */}
      <Modal
        visible={!!awardModalApp}
        transparent
        animationType="fade"
        onRequestClose={() => setAwardModalApp(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl items-center">
            <View className="w-16 h-16 rounded-full bg-amber-50 items-center justify-center mb-3 border border-amber-200">
              <Medal color="#d97706" height={36} width={36} strokeWidth={2.5} />
            </View>
            <Text className="text-lg font-black text-slate-900 text-center mb-1">
              Award "Vein of Hope" Badge
            </Text>
            <Text className="text-xs text-slate-500 text-center mb-4 leading-5">
              Confirm that {awardModalApp?.donor?.name} has successfully completed screened blood donation. This unlocks their digital honor certificate and updates medical cooldown.
            </Text>

            <View className="flex-row space-x-3 w-full">
              <TouchableOpacity
                onPress={() => setAwardModalApp(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 items-center justify-center mr-2"
              >
                <Text className="font-bold text-slate-700 text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCompleteAndAwardBadge}
                className="flex-1 py-3 rounded-xl bg-amber-600 items-center justify-center shadow-md ml-2"
              >
                <Text className="font-bold text-white text-sm">
                  Yes, Award Badge
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
