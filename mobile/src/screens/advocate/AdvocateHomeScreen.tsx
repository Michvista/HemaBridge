import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  PanResponder,
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
import {
  BouncyPressable,
  ShimmerCard,
  ButtonLoadingContent,
} from '../../components/MicroInteractions';

export const AdvocateHomeScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [selectedBloodType, setSelectedBloodType] = useState<string>('O+');
  const [donors, setDonors] = useState<any[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState<boolean>(true);
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

  const requestDrawerPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30) {
          setRequestModalVisible(false);
        }
      },
    }),
  ).current;

  const badgeGuidePanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30) {
          setBadgeGuideModalVisible(false);
        }
      },
    }),
  ).current;

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  useEffect(() => {
    loadEligibleDonors();
  }, [selectedBloodType]);

  const loadEligibleDonors = async () => {
    setIsLoadingDonors(true);
    try {
      const res = await apiClient.get(
        `/donors/eligible?bloodType=${encodeURIComponent(selectedBloodType)}`,
      );
      setDonors(res.data);
    } catch (err) {
      console.log('Error loading eligible donors:', err);
    } finally {
      setIsLoadingDonors(false);
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
          <View className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Text className="text-amber-900 font-bold text-[10px]">
              Direct Match
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
            View Safety Guide →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Patient Needed Blood Type (CENTERED) */}
      <View className="mb-4 items-center">
        <Text className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2.5 text-center">
          Patient Needed Blood Group
        </Text>

        {/* Centered Blood Group Grid */}
        <View className="flex-row flex-wrap justify-center gap-2 max-w-sm">
          {bloodTypes.map((type) => {
            const isSelected = selectedBloodType === type;
            return (
              <TouchableOpacity
                key={type}
                activeOpacity={0.8}
                onPress={() => setSelectedBloodType(type)}
                className={`min-w-[70px] py-2.5 px-3 rounded-2xl border items-center justify-center shadow-xs ${
                  isSelected
                    ? 'bg-[#990011] border-[#990011]'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`text-sm font-black ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Screened Donor Results Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-black text-slate-500 uppercase tracking-wider">
          Available Donors ({donors.length})
        </Text>
        <Text className="text-[11px] text-emerald-700 font-bold">
          Ready to Mobilize
        </Text>
      </View>

      {/* Donors List */}
      <View className="space-y-3">
        {isLoadingDonors ? (
          <>
            <ShimmerCard height={130} />
            <ShimmerCard height={130} />
          </>
        ) : donors.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 border border-slate-200 items-center justify-center">
            <Heart color="#94a3b8" width={28} height={28} />
            <Text className="text-sm font-black text-slate-800 mt-2">
              No Direct Donors on Standby for {selectedBloodType}
            </Text>
            <Text className="text-xs text-slate-500 text-center mt-1">
              Broadcast an alert to accredited hospitals and emergency drives nearby.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDonor(null);
                setRequestModalVisible(true);
              }}
              className="mt-4 bg-[#990011] px-4 py-2.5 rounded-full"
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

                {/* Location & Badge Details */}
                <View className="bg-slate-50 rounded-xl p-2.5 my-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Pin color="#64748b" width={13} height={13} />
                    <Text className="text-xs text-slate-600 font-medium ml-1">
                      {dp?.area || 'Lagos'}
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setRequestModalVisible(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-5"
          >
            {/* Drawer Drag Handle */}
            <View
              {...requestDrawerPanResponder.panHandlers}
              className="items-center py-2 mb-2"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
              <Text className="text-[10px] text-slate-400 font-medium mt-1">
                Drag down or tap backdrop to close
              </Text>
            </View>

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

            <BouncyPressable
              onPress={handleSendRequest}
              disabled={isSubmitting}
              className="bg-[#990011] py-3.5 rounded-full items-center shadow-md mb-2"
            >
              <ButtonLoadingContent
                loading={isSubmitting}
                loadingText="Dispatching Emergency Request..."
                defaultText="Confirm & Dispatch Request"
              />
            </BouncyPressable>

            <TouchableOpacity
              onPress={() => setRequestModalVisible(false)}
              className="py-2 items-center"
            >
              <Text className="text-xs font-semibold text-slate-500">
                Cancel
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Advocate Safety Guide Modal */}
      <Modal
        visible={badgeGuideModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBadgeGuideModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setBadgeGuideModalVisible(false)}
          className="flex-1 bg-black/60 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-6 max-h-[80%]"
          >
            {/* Drawer Handle */}
            <View
              {...badgeGuidePanResponder.panHandlers}
              className="items-center py-2 mb-2"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
              <Text className="text-[10px] text-slate-400 font-medium mt-1">
                Drag down or tap backdrop to close
              </Text>
            </View>

            <Text className="text-xl font-black text-slate-900">
              Donor Safety & Recognition Guide
            </Text>
            <Text className="text-xs text-slate-500 mt-1 mb-4">
              Understanding clinical safety markers and honours
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-3">
                <Text className="text-xs font-black text-rose-900 mb-1">
                  Vein of Hope Certified
                </Text>
                <Text className="text-xs text-rose-800 leading-5">
                  Awarded only when a donor completes lab-tested screening at an accredited hospital (e.g. LUTH). Verifies clean viral markers (non-reactive for HIV, Hepatitis B/C, and Syphilis) and normal hemoglobin.
                </Text>
              </View>

              <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-3">
                <Text className="text-xs font-black text-amber-900 mb-1">
                  Silver Sentinel (Recovery Verified)
                </Text>
                <Text className="text-xs text-amber-800 leading-5">
                  Signifies that the donor has completed the recommended recovery period (90 days for men, 120 days for women), ensuring optimal iron levels and vital health for safe donation.
                </Text>
              </View>

              <View className="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-4">
                <Text className="text-xs font-black text-slate-900 mb-1">
                  Emergency Vanguard
                </Text>
                <Text className="text-xs text-slate-700 leading-5">
                  Recognizes rapid-response donors who answered hospital shortage broadcasts during emergency shortages.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setBadgeGuideModalVisible(false)}
                className="bg-slate-900 py-3.5 rounded-full items-center"
              >
                <Text className="text-white font-black text-xs">
                  Close Safety Guide
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};
