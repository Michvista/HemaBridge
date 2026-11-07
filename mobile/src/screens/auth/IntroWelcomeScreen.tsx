import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart, Shield, Hospital, User, NavArrowRight, Medal, Check } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';

interface IntroProps {
  onNavigateToAuth: () => void;
}

export const IntroWelcomeScreen: React.FC<IntroProps> = ({ onNavigateToAuth }) => {
  const { switchPersona } = useAuth();
  const [selectedPillar, setSelectedPillar] = useState<'donor' | 'advocate' | 'hospital'>('donor');

  const handleQuickDemo = (role: 'donor' | 'advocate' | 'hospital') => {
    switchPersona(role);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Crimson Banner */}
      <View className="bg-[#990011] pt-12 pb-10 px-6 rounded-b-[36px] shadow-xl">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 items-center justify-center mr-3 shadow-inner">
              <Heart color="#ffffff" width={26} height={26} strokeWidth={2.5} />
            </View>
            <View>
              <Text className="text-white text-2xl font-black tracking-tight">
                HemaBridge
              </Text>
              <Text className="text-rose-200 text-[11px] font-bold tracking-widest uppercase">
                Nigeria Emergency Lifeline
              </Text>
            </View>
          </View>

          <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30">
            <Text className="text-white text-[11px] font-black">3-in-1 Platform</Text>
          </View>
        </View>

        {/* Hero Value Prop */}
        <Text className="text-2xl font-black text-white leading-8 mt-2">
          "Every donor is a hope for someone's next breath."
        </Text>
        <Text className="text-sm text-rose-100 font-medium leading-5 mt-2">
          Bridging the critical gap between voluntary blood donors, emergency patient advocates,
          and hospital blood banks in Nigeria.
        </Text>

        {/* Primary CTA Buttons */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onNavigateToAuth}
            className="flex-1 bg-white py-3.5 px-4 rounded-2xl items-center justify-center shadow-md"
          >
            <Text className="text-[#990011] font-black text-sm">
              Sign In / Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleQuickDemo('donor')}
            className="flex-1 bg-rose-900/60 border border-white/30 py-3.5 px-4 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-extrabold text-sm">
              Quick Live Demo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Pillars Role Showcase */}
      <View className="px-5 pt-6">
        <View className="mb-4">
          <Text className="text-xs font-black text-rose-800 tracking-widest uppercase">
            HOW HEMABRIDGE WORKS
          </Text>
          <Text className="text-xl font-black text-slate-900 mt-0.5">
            Who Are You On The Lifeline?
          </Text>
        </View>

        {/* Segmented Switcher */}
        <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-5 border border-slate-200/60">
          {(
            [
              { id: 'donor', label: 'Blood Donor', icon: Heart },
              { id: 'advocate', label: 'Patient Advocate', icon: User },
              { id: 'hospital', label: 'Hospital Desk', icon: Hospital },
            ] as const
          ).map((item) => {
            const isActive = selectedPillar === item.id;
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedPillar(item.id)}
                className={`flex-1 py-2.5 px-1 rounded-xl items-center justify-center ${
                  isActive ? 'bg-[#990011] shadow-sm' : ''
                }`}
              >
                <Icon
                  color={isActive ? '#ffffff' : '#64748b'}
                  width={16}
                  height={16}
                  strokeWidth={2.2}
                />
                <Text
                  className={`text-[11px] font-extrabold mt-1 text-center ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Pillar Feature Card */}
        {selectedPillar === 'donor' && (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-2xl bg-rose-100 items-center justify-center mr-3 border border-rose-200">
                <Heart color="#990011" width={24} height={24} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-slate-900">
                  Voluntary Blood Donor
                </Text>
                <Text className="text-xs text-slate-500 font-semibold">
                  Safe, tracked, and game-honoured giving
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Biological Cooldown Tracking:</Text> 3 months for males, 4 months for females to guarantee medical safety.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Emergency Radar Alerts:</Text> Get notified when accredited hospitals near you suffer severe shortages.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Vein of Hope Honours:</Text> Earn game badges, lifesaver ranks, and accredited digital certificates.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleQuickDemo('donor')}
              className="bg-[#990011] py-3 rounded-2xl flex-row items-center justify-center shadow"
            >
              <Text className="text-white font-extrabold text-xs mr-1.5">
                Launch as Donor Amara Miller (O+)
              </Text>
              <NavArrowRight color="#ffffff" width={16} height={16} />
            </TouchableOpacity>
          </View>
        )}

        {selectedPillar === 'advocate' && (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-2xl bg-amber-100 items-center justify-center mr-3 border border-amber-200">
                <User color="#b45309" width={24} height={24} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-slate-900">
                  Patient Advocate
                </Text>
                <Text className="text-xs text-slate-500 font-semibold">
                  For family, caregivers & emergency seekers
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Panic-Free Sourcing:</Text> Stop searching social media frantically—filter verified active donors by blood type (O+, O-, A+, etc.).
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Privacy-Shielded Direct Chat:</Text> Secure messaging with willing donors without exposing sensitive personal numbers.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleQuickDemo('advocate')}
              className="bg-amber-700 py-3 rounded-2xl flex-row items-center justify-center shadow"
            >
              <Text className="text-white font-extrabold text-xs mr-1.5">
                Launch as Advocate Bolanle Adebayo
              </Text>
              <NavArrowRight color="#ffffff" width={16} height={16} />
            </TouchableOpacity>
          </View>
        )}

        {selectedPillar === 'hospital' && (
          <View className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center mr-3 border border-blue-200">
                <Hospital color="#1d4ed8" width={24} height={24} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-slate-900">
                  Hospital & Blood Bank Desk
                </Text>
                <Text className="text-xs text-slate-500 font-semibold">
                  Clinical intake & shortage broadcasting
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Desk Status & Shortage Radar:</Text> Toggle donation desk open/closed and broadcast urgent blood needs across the network.
                </Text>
              </View>

              <View className="flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-emerald-100 items-center justify-center mr-2.5 mt-0.5">
                  <Check color="#059669" width={12} height={12} strokeWidth={3} />
                </View>
                <Text className="text-xs text-slate-700 flex-1 leading-4">
                  <Text className="font-bold text-slate-900">Intake Appointment Scheduler:</Text> Schedule clinical screening appointments and award verified Vein of Hope badges.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => handleQuickDemo('hospital')}
              className="bg-blue-700 py-3 rounded-2xl flex-row items-center justify-center shadow"
            >
              <Text className="text-white font-extrabold text-xs mr-1.5">
                Launch as LUTH Clinical Desk
              </Text>
              <NavArrowRight color="#ffffff" width={16} height={16} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Safety & Compliance Badge */}
      <View className="mx-5 mt-6 bg-slate-100 border border-slate-200 rounded-2xl p-4 flex-row items-center">
        <View className="w-10 h-10 rounded-xl bg-slate-200 items-center justify-center mr-3">
          <Shield color="#334155" width={20} height={20} />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-black text-slate-800">
            Medical Safety & HEFAMAA Compliant
          </Text>
          <Text className="text-[11px] text-slate-500 mt-0.5 leading-4">
            Operates in compliance with Nigerian National Blood Transfusion Service guidelines.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
