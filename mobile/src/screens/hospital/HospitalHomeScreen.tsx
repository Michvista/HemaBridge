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
  Clock,
  Pin,
  WarningTriangle,
  Activity,
  User as UserIcon,
  Shield,
} from '../../components/Icons';

export const HospitalHomeScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const hospital = user?.hospitalProfile;
  const [isDeskOpen, setIsDeskOpen] = useState<boolean>(
    hospital?.isDeskOpen ?? true,
  );
  const [requestDonorsActive, setRequestDonorsActive] = useState<boolean>(
    hospital?.requestDonorsActive ?? true,
  );
  const [stats, setStats] = useState({
    activeShortages: 3,
    intakeQueueCount: 4,
    verifiedUnitsCollected: 128,
  });

  const handleToggleDesk = async (value: boolean) => {
    setIsDeskOpen(value);
    try {
      await apiClient.patch('/hospitals/status', { isDeskOpen: value });
    } catch (err) {
      setIsDeskOpen(!value);
      Alert.alert('Error', 'Unable to update donation desk status.');
    }
  };

  const handleToggleRequest = async (value: boolean) => {
    setRequestDonorsActive(value);
    try {
      await apiClient.patch('/hospitals/status', { requestDonorsActive: value });
    } catch (err) {
      setRequestDonorsActive(!value);
      Alert.alert('Error', 'Unable to update request broadcast status.');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hospital Clinical Banner */}
      <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center mr-3">
              <Hospital color="#059669" height={22} width={22} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-slate-900 font-black text-base">
                {hospital?.name || 'Hospital Clinical Desk'}
              </Text>
              <Text className="text-slate-500 text-xs">
                {hospital?.address || 'Idi-Araba, Surulere, Lagos'}
              </Text>
            </View>
          </View>

          <View
            className={`px-3 py-1 rounded-full border ${
              isDeskOpen
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <Text
              className={`text-[10px] font-black ${
                isDeskOpen ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {isDeskOpen ? 'DESK OPEN' : 'DESK CLOSED'}
            </Text>
          </View>
        </View>

        <Text className="text-slate-500 text-xs mt-2 leading-5">
          Licensed Transfusion Center • Accreditation Lic: <Text className="font-mono text-slate-700 font-bold">{hospital?.operatingLicence || 'HEFAMAA-LG-001'}</Text>
        </Text>
      </View>

      {/* Donation Desk Controls */}
      <Text className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
        Donation Desk Controls
      </Text>

      <View className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-4">
        {/* Desk Open/Closed */}
        <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
          <View className="flex-1 mr-3">
            <Text className="font-extrabold text-slate-900 text-sm">
              Donation Desk Availability
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {isDeskOpen
                ? 'Desk is Open for clinical appointments and walk-in voluntary donors'
                : 'Desk is currently Closed to voluntary donors'}
            </Text>
          </View>
          <Switch
            value={isDeskOpen}
            onValueChange={handleToggleDesk}
            trackColor={{ false: '#cbd5e1', true: '#059669' }}
            thumbColor="#ffffff"
          />
        </View>

        {/* Shortage Broadcast */}
        <View className="flex-row items-center justify-between py-2 pt-3">
          <View className="flex-1 mr-3">
            <Text className="font-extrabold text-slate-900 text-sm">
              Emergency Shortage Broadcast Radar
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              {requestDonorsActive
                ? 'Actively broadcasting O+, O-, A- urgent shortages to nearby donors'
                : 'Shortage broadcast is currently paused'}
            </Text>
          </View>
          <Switch
            value={requestDonorsActive}
            onValueChange={handleToggleRequest}
            trackColor={{ false: '#cbd5e1', true: '#be123c' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Hospital Shortage Alert Panel */}
      <View className="bg-rose-50 border border-rose-200 rounded-3xl p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <WarningTriangle color="#990011" height={18} width={18} strokeWidth={2.5} />
            <Text className="text-xs font-black text-[#990011] uppercase tracking-wider ml-1.5">
              Current Critical Shortage
            </Text>
          </View>
          <View className="bg-rose-100 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-black text-rose-800">DEFICIT</Text>
          </View>
        </View>

        <Text className="text-xs text-slate-700 leading-4">
          Red alert broadcasted to Hemabridge network:
        </Text>
        <View className="flex-row gap-2 mt-2">
          {['O+', 'O-', 'A-'].map((type) => (
            <View
              key={type}
              className="bg-white border border-rose-300 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text className="text-xs font-black text-[#990011]">{type}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Console Stats */}
      <Text className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
        Clinical Activity Overview
      </Text>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <Text className="text-2xl font-black text-slate-900">
            {stats.verifiedUnitsCollected}
          </Text>
          <Text className="text-[11px] font-semibold text-slate-500 mt-0.5">
            Verified Units Collected
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <Text className="text-2xl font-black text-emerald-700">
            {stats.intakeQueueCount}
          </Text>
          <Text className="text-[11px] font-semibold text-slate-500 mt-0.5">
            Awaiting Lab Screening
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Queue')}
        className="bg-slate-900 py-3.5 rounded-2xl items-center shadow"
      >
        <Text className="text-white font-black text-xs">
          Open Clinical Screening Queue →
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
