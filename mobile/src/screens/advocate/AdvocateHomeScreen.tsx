import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { BloodType, UrgencyLevel } from '../../types';
import {
  Heart,
  Search,
  Pin,
  Clock,
  Shield,
  WarningTriangle,
  Check,
  Medal,
} from '../../components/Icons';

export const AdvocateHomeScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [selectedBloodType, setSelectedBloodType] = useState<string>('O+');
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [requestModalVisible, setRequestModalVisible] = useState<boolean>(false);
  const [badgeGuideModalVisible, setBadgeGuideModalVisible] = useState<boolean>(false);

  const [hospitalName, setHospitalName] = useState<string>(
    'Lagos University Teaching Hospital (LUTH)',
  );
  const [location, setLocation] = useState<string>('Surulere, Lagos');
  const [urgency, setUrgency] = useState<UrgencyLevel>(UrgencyLevel.EMERGENCY);
  const [note, setNote] = useState<string>(
    'Urgent replacement units needed for post-op emergency transfusion.',
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  useEffect(() => {
    loadEligibleDonors();
  }, [selectedBloodType]);

  const loadEligibleDonors = async () => {
    try {
      const res = await apiClient.get(
        `/donors/eligible?bloodType=${encodeURIComponent(selectedBloodType)}`,
      );
      setDonors(res.data);
    } catch (err) {
      console.log('Error loading eligible donors:', err);
    }
  };

  const handleSendRequest = async () => {
    if (!hospitalName || !location) {
      Alert.alert('Required Fields', 'Please enter hospital name and location.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/requests/create', {
        patientName: 'Emergency Patient Relative',
        bloodType: selectedBloodType,
        hospitalName,
        location,
        urgency,
        note,
        donorUserId: selectedDonor?.id,
      });

      setRequestModalVisible(false);
      Alert.alert(
        'Request Dispatched',
        `Your urgent request for ${selectedBloodType} blood has been sent to ${
          selectedDonor ? selectedDonor.name : 'screened compatible donors'
        }.`,
      );
    } catch (err) {
      Alert.alert('Error', 'Unable to dispatch request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Advocate Emergency Banner */}
      <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 items-center justify-center mr-3">
              <Shield color="#b45309" height={22} width={22} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-base">
                Find Compatible Donors
              </Text>
              <Text className="text-slate-500 text-xs">
                Emergency Blood Matchmaking for Patients
              </Text>
            </View>
          </View>
          <View className="bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">
            <Text className="text-amber-900 font-black text-[10px]">
              CONFIDENTIAL
            </Text>
          </View>
        </View>

        <Text className="text-xs text-slate-600 mt-2 leading-5">
          Connecting patient advocates with voluntary donors.
          Donors are screened under clinical guidelines to protect your loved one.
        </Text>

        {/* Badge Lore Guide Trigger */}
        <TouchableOpacity
          onPress={() => setBadgeGuideModalVisible(true)}
          className="mt-3 pt-3 border-t border-slate-100 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Medal color="#d97706" width={16} height={16} />
            <Text className="text-xs font-bold text-amber-900 ml-1.5">
              What do Donor Badges Mean?
            </Text>
          </View>
          <Text className="text-[11px] font-bold text-[#990011]">
            View Safety Lore Guide →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Blood Group Filter */}
      <Text className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
        Patient Needed Blood Type (ABO & Rh)
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {bloodTypes.map((type) => {
          const isSelected = selectedBloodType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedBloodType(type)}
              className={`mr-2 px-4 py-2 rounded-2xl border ${
                isSelected
                  ? 'bg-[#990011] border-[#990011] shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-sm font-black ${
                  isSelected ? 'text-white' : 'text-slate-700'
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Screened Donor Results Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-black text-slate-500 uppercase tracking-wider">
          Screened Available Donors ({donors.length})
        </Text>
        <Text className="text-[11px] text-emerald-700 font-bold">
          ● Ready to Mobilize
        </Text>
      </View>

      {/* Donors List */}
      <View className="space-y-3">
        {donors.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 border border-slate-200 items-center justify-center">
            <Heart color="#94a3b8" width={28} height={28} />
            <Text className="text-sm font-black text-slate-800 mt-2">
              No Direct Donors on Standby for {selectedBloodType}
            </Text>
            <Text className="text-xs text-slate-500 text-center mt-1">
              Tap below to broadcast a network-wide distress alert to accredited hospitals and blood drives.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDonor(null);
                setRequestModalVisible(true);
              }}
              className="mt-4 bg-[#990011] px-4 py-2.5 rounded-xl"
            >
              <Text className="text-white text-xs font-bold">
                Broadcast Emergency Request
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          donors.map((donor) => {
            const dp = donor.donorProfile;
            return (
              <View
                key={donor.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 items-center justify-center mr-3">
                      <Heart color="#990011" width={20} height={20} strokeWidth={2.5} />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <Text className="font-black text-slate-900 text-sm mr-1.5">
                          {donor.name}
                        </Text>
                        <View className="bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          <Text className="text-[9px] font-black text-emerald-800">
                            SCREENED
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-slate-500 mt-0.5">
                        Blood Type <Text className="font-bold text-slate-800">{dp?.bloodType}</Text> • {dp?.gender === 'female' ? 'Female' : 'Male'}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                    <Text className="text-xs font-black text-[#990011]">
                      {dp?.bloodType}
                    </Text>
                  </View>
                </View>

                {/* Location & Badge Lore Details */}
                <View className="bg-slate-50 rounded-xl p-2.5 my-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Pin color="#64748b" width={13} height={13} />
                    <Text className="text-xs text-slate-600 font-medium ml-1">
                      {dp?.area || 'Lagos'} ({dp?.state || 'Lagos State'})
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Medal color="#d97706" width={13} height={13} />
                    <Text className="text-xs font-bold text-amber-900 ml-1">
                      {dp?.badgeEarnedCount || 1} Vein of Hope Award
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-2 mt-1">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Chat', {
                        screen: 'ChatRoom',
                        params: {
                          otherUserId: donor.id,
                          otherUserName: donor.name,
                          role: 'donor',
                        },
                      });
                    }}
                    className="flex-1 bg-slate-100 border border-slate-200 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-xs font-bold text-slate-700">
                      Message Donor
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDonor(donor);
                      setRequestModalVisible(true);
                    }}
                    className="flex-1 bg-[#990011] py-2.5 rounded-xl items-center shadow-sm"
                  >
                    <Text className="text-xs font-black text-white">
                      Request Connect
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Request Connect Drawer Modal */}
      <Modal
        visible={requestModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            {/* Drawer Drag-to-Dismiss Handle */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRequestModalVisible(false)}
              className="items-center py-1.5 mb-2"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </TouchableOpacity>

            <Text className="text-lg font-black text-slate-900 mb-0.5">
              Emergency Request to Connect
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Dispatched to {selectedDonor ? selectedDonor.name : 'screened donors'}:
            </Text>

            {/* Hospital Name */}
            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-700 mb-1">
                Hospital / Clinical Center
              </Text>
              <TextInput
                value={hospitalName}
                onChangeText={setHospitalName}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
              />
            </View>

            {/* Location */}
            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-700 mb-1">
                Ward / Department & Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
              />
            </View>

            {/* Urgency */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1.5">
                Urgency Level
              </Text>
              <View className="flex-row gap-2">
                {[UrgencyLevel.EMERGENCY, UrgencyLevel.URGENT, UrgencyLevel.NORMAL].map(
                  (lvl) => {
                    const isSel = urgency === lvl;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        onPress={() => setUrgency(lvl)}
                        className={`flex-1 py-2 rounded-xl items-center border ${
                          isSel
                            ? lvl === UrgencyLevel.EMERGENCY
                              ? 'bg-rose-700 border-rose-700'
                              : 'bg-slate-900 border-slate-900'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-black uppercase ${
                            isSel ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          {lvl}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSendRequest}
              disabled={isSubmitting}
              className="bg-[#990011] py-3.5 rounded-2xl items-center shadow-md mb-2"
            >
              <Text className="text-white font-black text-sm">
                {isSubmitting ? 'Dispatching...' : 'Confirm & Dispatch Request'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRequestModalVisible(false)}
              className="py-2 items-center"
            >
              <Text className="text-xs font-semibold text-slate-500">
                Cancel / Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Advocate Vein of Hope Lore Guide Modal */}
      <Modal
        visible={badgeGuideModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBadgeGuideModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            {/* Drawer Handle */}
            <TouchableOpacity
              onPress={() => setBadgeGuideModalVisible(false)}
              className="items-center py-1 mb-3"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </TouchableOpacity>

            <Text className="text-xl font-black text-slate-900">
              Why Donor Badges Matter to Patients
            </Text>
            <Text className="text-xs text-slate-500 mt-1 mb-4">
              A patient advocate guide to blood safety markers and honours in Nigeria
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-3">
                <Text className="text-xs font-black text-rose-900 mb-1">
                  🥇 Vein of Hope Certified
                </Text>
                <Text className="text-xs text-rose-800 leading-5">
                  Awarded only when a donor completes lab-tested screening at an accredited hospital (e.g. LUTH). Verifies clean viral markers (non-reactive for HIV, Hepatitis B/C, and Syphilis) and normal hemoglobin.
                </Text>
              </View>

              <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-3">
                <Text className="text-xs font-black text-amber-900 mb-1">
                  🛡️ Silver Sentinel / Cooldown Verified
                </Text>
                <Text className="text-xs text-amber-800 leading-5">
                  Signifies that the donor is past their mandatory biological recovery interval (3 months for males, 4 months for females), ensuring their iron levels and plasma are optimal for the recipient.
                </Text>
              </View>

              <View className="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-4">
                <Text className="text-xs font-black text-slate-900 mb-1">
                  ⚡ Emergency Vanguard
                </Text>
                <Text className="text-xs text-slate-700 leading-5">
                  Recognizes rapid-response donors who answered critical hospital shortage broadcasts when blood bank reserves hit zero.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setBadgeGuideModalVisible(false)}
                className="bg-slate-900 py-3.5 rounded-2xl items-center"
              >
                <Text className="text-white font-black text-xs">
                  Got It — Close Safety Guide
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
