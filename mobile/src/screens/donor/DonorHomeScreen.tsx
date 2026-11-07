import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { CooldownWidget } from '../../components/CooldownWidget';
import { StatusBadge } from '../../components/StatusBadge';
import { HospitalProfile } from '../../types';
import {
  Heart,
  Hospital,
  Pin,
  Clock,
  Medal,
  Check,
  WarningTriangle,
} from '../../components/Icons';

export const DonorHomeScreen: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState<boolean>(
    user?.donorProfile?.isAvailable ?? true,
  );
  const [hospitals, setHospitals] = useState<HospitalProfile[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalProfile | null>(
    null,
  );
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [applyModalVisible, setApplyModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      const res = await apiClient.get('/hospitals');
      setHospitals(res.data);
    } catch (err) {
      console.log('Error loading hospitals:', err);
    }
  };

  const handleToggleAvailability = async (value: boolean) => {
    setIsAvailable(value);
    try {
      await apiClient.post('/donors/availability', { isAvailable: value });
      await refreshProfile();
    } catch (err) {
      setIsAvailable(!value);
      Alert.alert('Error', 'Unable to update availability status.');
    }
  };

  const handleApply = async () => {
    if (!selectedHospital || !user) return;
    setIsApplying(true);
    try {
      await apiClient.post('/applications/apply', {
        hospitalId: selectedHospital.id,
        bloodType: user.donorProfile?.bloodType || 'O+',
      });
      setApplyModalVisible(false);
      Alert.alert(
        'Application Submitted',
        `Your voluntary donation application has been sent to ${selectedHospital.name}. The clinical team will schedule your screening appointment shortly.`,
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  const donorProfile = user?.donorProfile;
  const eligibility = donorProfile?.eligibility || {
    eligible: true,
    daysRemaining: 0,
    intervalMonths: donorProfile?.gender === 'female' ? 4 : 3,
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4">
        {/* Availability Hero Banner */}
        <View className="bg-rose-900 rounded-3xl p-5 mb-4 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center mr-3">
                <Heart color="#ffffff" height={22} width={22} strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-white font-extrabold text-base">
                  {user?.name || 'Voluntary Donor'}
                </Text>
                <Text className="text-rose-200 text-xs">
                  Blood Group {donorProfile?.bloodType || 'O+'} • {donorProfile?.area || 'Lagos'}
                </Text>
              </View>
            </View>

            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-xs">
                {donorProfile?.bloodType || 'O+'}
              </Text>
            </View>
          </View>

          {/* Toggle Switch */}
          <View className="bg-black/20 rounded-2xl p-3.5 flex-row items-center justify-between mt-3">
            <View className="flex-1 mr-3">
              <Text className="text-white font-bold text-xs">
                Active Donor Availability
              </Text>
              <Text className="text-rose-200 text-[11px] mt-0.5">
                {isAvailable
                  ? 'Advocates and hospitals can see you are ready to donate'
                  : 'You are currently marked as unavailable'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={handleToggleAvailability}
              trackColor={{ false: '#4c0519', true: '#10b981' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Medical Cooldown Calculator Widget */}
        <CooldownWidget
          daysRemaining={eligibility.daysRemaining}
          intervalMonths={eligibility.intervalMonths}
          eligible={eligibility.eligible}
          gender={donorProfile?.gender || 'female'}
        />

        {/* Quick Badges Counter */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mr-3">
              <Medal color="#d97706" height={22} width={22} strokeWidth={2} />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-900">
                Vein of Hope Honours
              </Text>
              <Text className="text-xs text-slate-500">
                Recognized voluntary donor badges
              </Text>
            </View>
          </View>
          <View className="bg-amber-100 px-3 py-1 rounded-full">
            <Text className="text-amber-800 font-extrabold text-sm">
              {donorProfile?.badgeEarnedCount || 1} Earned
            </Text>
          </View>
        </View>

        {/* Nearby Accredited Hospitals Section */}
        <View className="mb-2">
          <Text className="text-base font-extrabold text-slate-900 mb-1">
            Accredited Hospitals & Blood Desks
          </Text>
          <Text className="text-xs text-slate-500 mb-3">
            Real-time blood bank status and urgent group shortages in Lagos
          </Text>

          {hospitals.map((hosp) => (
            <View
              key={hosp.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-2">
                  <Text className="font-extrabold text-slate-900 text-sm">
                    {hosp.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Pin color="#64748b" height={13} width={13} />
                    <Text className="text-xs text-slate-500 ml-1">
                      {hosp.address}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={hosp.isDeskOpen ? 'Open' : 'Closed'} />
              </View>

              <View className="flex-row items-center justify-between pt-2 border-t border-slate-100 mt-2">
                <View className="flex-row items-center space-x-2">
                  <Text className="text-xs text-slate-500">
                    Distance: <Text className="font-bold text-slate-700">{hosp.distance}</Text>
                  </Text>
                  <Text className="text-xs text-slate-400">•</Text>
                  <Text className="text-xs text-slate-500">
                    ETA: <Text className="font-bold text-slate-700">{hosp.eta}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedHospital(hosp);
                    setApplyModalVisible(true);
                  }}
                  className="bg-rose-700 px-3.5 py-1.5 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-xs font-bold">Apply</Text>
                </TouchableOpacity>
              </View>

              {/* Needed Blood Types */}
              <View className="flex-row items-center mt-2.5 bg-rose-50/60 p-2 rounded-xl">
                <Text className="text-[11px] font-bold text-rose-800 mr-2">
                  Needed Groups:
                </Text>
                <View className="flex-row flex-wrap">
                  {(Array.isArray(hosp.neededBloodTypes)
                    ? hosp.neededBloodTypes
                    : [hosp.neededBloodTypes]
                  ).map((type, idx) => (
                    <View
                      key={idx}
                      className="bg-white px-2 py-0.5 rounded-md mr-1 border border-rose-200"
                    >
                      <Text className="text-[11px] font-bold text-rose-900">
                        {type}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Apply Confirmation Modal */}
      <Modal
        visible={applyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setApplyModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="w-12 h-1 bg-slate-300 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-slate-900 mb-1">
              Apply to Donate Blood
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              {selectedHospital?.name}
            </Text>

            <View className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-slate-500">Your Blood Group:</Text>
                <Text className="text-xs font-bold text-slate-800">
                  {donorProfile?.bloodType || 'O+'}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-slate-500">Center Operating Hours:</Text>
                <Text className="text-xs font-bold text-slate-800">
                  {selectedHospital?.openingTime} - {selectedHospital?.closingTime}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-slate-500">Estimated Travel Time:</Text>
                <Text className="text-xs font-bold text-slate-800">
                  {selectedHospital?.eta}
                </Text>
              </View>
            </View>

            <Text className="text-[11px] text-slate-500 italic mb-5">
              Note: Clinical personnel will conduct pre-screening, haemoglobin level verification, and compatibility checks prior to collection.
            </Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setApplyModalVisible(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 items-center justify-center mr-2"
              >
                <Text className="font-bold text-slate-700 text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isApplying}
                onPress={handleApply}
                className="flex-1 py-3 rounded-xl bg-rose-700 items-center justify-center shadow-md ml-2"
              >
                <Text className="font-bold text-white text-sm">
                  {isApplying ? 'Submitting...' : 'Confirm Application'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
