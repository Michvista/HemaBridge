import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { HospitalProfile } from '../../types';
import {
  Hospital,
  Activity,
  Pin,
  Clock,
  Shield,
  Heart,
  Medal,
} from '../../components/Icons';

export const HospitalHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [isDeskOpen, setIsDeskOpen] = useState<boolean>(true);
  const [requestDonorsActive, setRequestDonorsActive] = useState<boolean>(true);

  useEffect(() => {
    loadHospitalProfile();
  }, []);

  const loadHospitalProfile = async () => {
    try {
      const res = await apiClient.get('/hospitals/my-profile');
      setHospital(res.data);
      setIsDeskOpen(res.data.isDeskOpen);
      setRequestDonorsActive(res.data.requestDonorsActive);
    } catch (err) {
      console.log('Error loading hospital profile:', err);
    }
  };

  const handleToggleDesk = async (value: boolean) => {
    setIsDeskOpen(value);
    try {
      await apiClient.patch('/hospitals/status', { isDeskOpen: value });
    } catch (err) {
      setIsDeskOpen(!value);
      Alert.alert('Error', 'Unable to update desk status.');
    }
  };

  const handleToggleRequestDonors = async (value: boolean) => {
    setRequestDonorsActive(value);
    try {
      await apiClient.patch('/hospitals/status', { requestDonorsActive: value });
    } catch (err) {
      setRequestDonorsActive(!value);
      Alert.alert('Error', 'Unable to update request broadcast status.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      {/* Hospital Hero Banner */}
      <View className="bg-emerald-950 rounded-3xl p-5 mb-4 shadow-md">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center mr-3">
              <Hospital color="#ffffff" height={22} width={22} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-white font-extrabold text-base">
                {hospital?.name || 'Hospital Clinical Portal'}
              </Text>
              <Text className="text-emerald-200 text-xs">
                {hospital?.address || 'Idi-Araba, Surulere, Lagos'}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-emerald-100/90 text-xs mt-2 leading-5">
          Licensed Transfusion Partner • Lic: {hospital?.operatingLicence || 'HEFAMAA-LG-001'}
        </Text>
      </View>

      {/* Desk Control Toggles */}
      <Text className="text-sm font-extrabold text-slate-900 mb-2">
        Donation Desk Controls
      </Text>

      <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4">
        <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
          <View className="flex-1 mr-3">
            <Text className="font-extrabold text-slate-900 text-sm">
              Donation Desk Status
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {isDeskOpen
                ? 'Desk is Open for screened voluntary donors'
                : 'Desk is Closed to external walk-in donors'}
            </Text>
          </View>
          <Switch
            value={isDeskOpen}
            onValueChange={handleToggleDesk}
            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
            thumbColor="#ffffff"
          />
        </View>

        <View className="flex-row items-center justify-between py-2 pt-3">
          <View className="flex-1 mr-3">
            <Text className="font-extrabold text-slate-900 text-sm">
              Urgent Donor Broadcast
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {requestDonorsActive
                ? 'Visible on Hemabridge matching radar for needed blood groups'
                : 'Broadcast muted'}
            </Text>
          </View>
          <Switch
            value={requestDonorsActive}
            onValueChange={handleToggleRequestDonors}
            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Hospital Stats Grid */}
      <Text className="text-sm font-extrabold text-slate-900 mb-2">
        Clinical Activity Overview
      </Text>

      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mr-2">
          <Text className="text-2xl font-black text-emerald-700">18</Text>
          <Text className="text-xs font-bold text-slate-800 mt-1">
            Completed Units
          </Text>
          <Text className="text-[10px] text-slate-400">This month</Text>
        </View>

        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mr-2">
          <Text className="text-2xl font-black text-amber-600">4</Text>
          <Text className="text-xs font-bold text-slate-800 mt-1">
            Screenings Set
          </Text>
          <Text className="text-[10px] text-slate-400">Scheduled</Text>
        </View>

        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Text className="text-2xl font-black text-rose-700">6</Text>
          <Text className="text-xs font-bold text-slate-800 mt-1">
            Emergency Calls
          </Text>
          <Text className="text-[10px] text-slate-400">Active matches</Text>
        </View>
      </View>

      {/* Currently In-Demand Blood Types */}
      <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
        <Text className="font-extrabold text-slate-900 text-sm mb-1">
          Currently In-Demand Groups at LUTH
        </Text>
        <Text className="text-xs text-slate-500 mb-3">
          Donors with these groups will see high-priority alerts in their feed:
        </Text>

        <View className="flex-row flex-wrap">
          {['O+', 'O-', 'A-'].map((type, i) => (
            <View
              key={i}
              className="bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-xl mr-2 mb-2"
            >
              <Text className="text-rose-900 font-extrabold text-sm">{type}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
