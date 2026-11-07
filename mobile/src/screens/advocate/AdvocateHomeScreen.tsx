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
} from '../../components/Icons';

export const AdvocateHomeScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const [selectedBloodType, setSelectedBloodType] = useState<string>('O+');
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [requestModalVisible, setRequestModalVisible] = useState<boolean>(false);
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
      await apiClient.post('/requests', {
        bloodType: selectedBloodType as BloodType,
        urgency,
        hospitalName,
        location,
        note,
        targetDonorId: selectedDonor?.userId,
      });

      setRequestModalVisible(false);
      Alert.alert(
        'Request Broadcasted',
        `Your urgent blood request for ${selectedBloodType} has been broadcast to available donors. You will be notified the instant a donor accepts.`,
      );
    } catch (err) {
      Alert.alert('Error', 'Unable to broadcast request.');
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
      <View className="bg-amber-900 rounded-3xl p-5 mb-4 shadow-md">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center mr-3">
              <Shield color="#ffffff" height={22} width={22} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-white font-extrabold text-base">
                Find Compatible Donors
              </Text>
              <Text className="text-amber-200 text-xs">
                Emergency Blood Matchmaking for Patients
              </Text>
            </View>
          </View>
          <View className="bg-amber-500 px-2.5 py-1 rounded-full">
            <Text className="text-slate-950 font-black text-[10px]">
              CONFIDENTIAL
            </Text>
          </View>
        </View>

        <Text className="text-amber-100/90 text-xs mt-2 leading-5">
          Select blood type needed to identify screened voluntary donors with active availability in Lagos.
        </Text>
      </View>

      {/* Blood Type Filter Pills */}
      <Text className="text-sm font-extrabold text-slate-900 mb-2">
        Select Required Blood Group:
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {bloodTypes.map((bt) => (
          <TouchableOpacity
            key={bt}
            onPress={() => setSelectedBloodType(bt)}
            className={`px-4 py-2.5 rounded-2xl mr-2.5 border items-center justify-center ${
              selectedBloodType === bt
                ? 'bg-rose-700 border-rose-800 shadow-sm'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`font-black text-sm ${
                selectedBloodType === bt ? 'text-white' : 'text-slate-700'
              }`}
            >
              {bt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Donors List */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-extrabold text-slate-900">
          Available {selectedBloodType} Donors ({donors.length})
        </Text>
      </View>

      {donors.length === 0 ? (
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-slate-100 shadow-sm mt-2">
          <Text className="font-bold text-slate-800 text-base mb-1">
            No Donors Currently Available
          </Text>
          <Text className="text-xs text-slate-500 text-center px-4 leading-5 mb-4">
            You can still broadcast an urgent request for {selectedBloodType} blood to all registered community donors and nearby hospital reserves.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedDonor(null);
              setRequestModalVisible(true);
            }}
            className="bg-rose-700 px-5 py-2.5 rounded-xl shadow-sm"
          >
            <Text className="text-white font-bold text-xs">
              Broadcast Emergency Request
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        donors.map((donor) => (
          <View
            key={donor.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3.5"
          >
            <View className="flex-row items-center justify-between mb-2.5">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center mr-3 border border-rose-200">
                  <Text className="text-rose-800 font-extrabold text-sm">
                    {donor.initials || 'BD'}
                  </Text>
                </View>
                <View>
                  <Text className="font-extrabold text-slate-900 text-sm">
                    {donor.name}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {donor.gender === 'female' ? 'Female Donor' : 'Male Donor'} • {donor.area}
                  </Text>
                </View>
              </View>

              <View className="bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Text className="text-[11px] font-bold text-emerald-700">
                  Ready Now
                </Text>
              </View>
            </View>

            <View className="bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Shield color="#059669" height={14} width={14} />
                <Text className="text-[11px] text-slate-600 font-medium ml-1.5">
                  Privacy Protected Contact
                </Text>
              </View>
              <Text className="text-[11px] text-slate-500 font-bold">
                {donor.phone}
              </Text>
            </View>

            <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
              <Text className="text-xs text-slate-500">
                Vein of Hope: <Text className="font-bold text-slate-800">{donor.badgeEarnedCount || 1} Awards</Text>
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedDonor(donor);
                  setRequestModalVisible(true);
                }}
                className="bg-rose-700 px-4 py-2 rounded-xl shadow-sm"
              >
                <Text className="text-white text-xs font-bold">
                  Request to Connect
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {/* Request to Connect Modal */}
      <Modal
        visible={requestModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="w-12 h-1 bg-slate-300 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-slate-900 mb-1">
              Request Blood Donation
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Target: {selectedDonor ? selectedDonor.name : `Any Available ${selectedBloodType} Donor`}
            </Text>

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Designated Hospital:
            </Text>
            <TextInput
              value={hospitalName}
              onChangeText={setHospitalName}
              placeholder="e.g. Lagos University Teaching Hospital"
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs text-slate-900"
            />

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Location / Area:
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Idi-Araba, Surulere"
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs text-slate-900"
            />

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Urgency Level:
            </Text>
            <View className="flex-row space-x-2 mb-3">
              {[UrgencyLevel.EMERGENCY, UrgencyLevel.URGENT, UrgencyLevel.NORMAL].map(
                (lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setUrgency(lvl)}
                    className={`flex-1 py-2 rounded-xl border items-center mr-1 ${
                      urgency === lvl
                        ? 'bg-rose-700 border-rose-800'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        urgency === lvl ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <Text className="text-xs font-bold text-slate-700 mb-1">
              Clinical Note for Donor:
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              placeholder="State patient condition, department, or replacement requirement"
              className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs text-slate-900"
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setRequestModalVisible(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 items-center justify-center mr-2"
              >
                <Text className="font-bold text-slate-700 text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSubmitting}
                onPress={handleSendRequest}
                className="flex-1 py-3 rounded-xl bg-rose-700 items-center justify-center shadow-md ml-2"
              >
                <Text className="font-bold text-white text-sm">
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
