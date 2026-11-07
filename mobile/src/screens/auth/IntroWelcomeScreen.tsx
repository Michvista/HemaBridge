import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart, Shield, Hospital, User, NavArrowRight, Medal, Check, Clock } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';

interface IntroProps {
  onNavigateToAuth: () => void;
}

export const IntroWelcomeScreen: React.FC<IntroProps> = ({ onNavigateToAuth }) => {
  const { switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<'donor' | 'advocate' | 'hospital'>('donor');

  const handleQuickDemo = (role: 'donor' | 'advocate' | 'hospital') => {
    switchPersona(role);
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Brand Bar */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-2xl bg-[#990011] items-center justify-center mr-3 shadow-sm">
            <Heart color="#ffffff" width={22} height={22} strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-xl font-black text-slate-900 tracking-tight">
              Hema<Text className="text-[#990011]">bridge</Text>
            </Text>
            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Nigeria Emergency Lifeline
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onNavigateToAuth}
          className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm"
        >
          <Text className="text-xs font-bold text-slate-700">Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Showcase Card */}
      <View className="px-5 mt-2">
        <View className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
              <Text className="text-[11px] font-black text-[#990011] tracking-wide uppercase">
                3-in-1 Humanitarian Movement
              </Text>
            </View>
          </View>

          <Text className="text-3xl font-black text-slate-900 leading-9 tracking-tight">
            Every donor is a hope for someone's next breath.
          </Text>

          <Text className="text-xs text-slate-600 font-medium leading-5 mt-3">
            In Nigeria, emergency trauma and surgeries face acute blood shortages daily.
            Hemabridge unites verified voluntary donors, distressed patient families, and accredited
            hospital blood banks into one panic-free network.
          </Text>

          {/* Quick Metrics Strip */}
          <View className="flex-row items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <View>
              <Text className="text-base font-black text-slate-900">3 & 4 Mo</Text>
              <Text className="text-[10px] text-slate-500 font-semibold">Biological Safety Cooldown</Text>
            </View>
            <View className="w-px h-8 bg-slate-200" />
            <View>
              <Text className="text-base font-black text-[#990011]">O+ O- A+ B+</Text>
              <Text className="text-[10px] text-slate-500 font-semibold">All Blood Types Match</Text>
            </View>
            <View className="w-px h-8 bg-slate-200" />
            <View>
              <Text className="text-base font-black text-slate-900">HEFAMAA</Text>
              <Text className="text-[10px] text-slate-500 font-semibold">Clinical Standards</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Role Perspectives Selector */}
      <View className="px-5 mt-6">
        <Text className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
          Choose Your Perspective
        </Text>

        <View className="flex-row bg-slate-200/80 p-1 rounded-2xl mb-4">
          {(
            [
              { id: 'donor', label: 'Blood Donor', icon: Heart },
              { id: 'advocate', label: 'Patient Advocate', icon: User },
              { id: 'hospital', label: 'Hospital Portal', icon: Hospital },
            ] as const
          ).map((item) => {
            const isSel = activeTab === item.id;
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveTab(item.id)}
                className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                  isSel ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Icon
                  color={isSel ? '#990011' : '#64748b'}
                  width={16}
                  height={16}
                  strokeWidth={2.4}
                />
                <Text
                  className={`text-[11px] font-extrabold mt-1 ${
                    isSel ? 'text-slate-900' : 'text-slate-600'
                  }`}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Role Card */}
        {activeTab === 'donor' && (
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 items-center justify-center mr-3">
                <Heart color="#990011" width={22} height={22} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-slate-900">
                  Voluntary Blood Donor Hub
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Save lives in your community safely and earn Vein of Hope honours
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  3mo (Male) / 4mo (Female) biological cooldown countdown
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Hospital emergency blood shortage radar alerts
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Game-style Vein of Hope badges & accredited certificates
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleQuickDemo('donor')}
              className="bg-[#990011] py-3.5 rounded-2xl flex-row items-center justify-center shadow-sm"
            >
              <Text className="text-white font-black text-xs mr-1.5">
                Launch as Donor Amara Miller (O+)
              </Text>
              <NavArrowRight color="#ffffff" width={14} height={14} />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'advocate' && (
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 items-center justify-center mr-3">
                <User color="#b45309" width={22} height={22} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-slate-900">
                  Patient Advocate Portal
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Panic-free blood matchmaking for relatives & trauma patients
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Filter verified active donors by exact ABO/Rhesus blood group
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Privacy-shielded direct messaging without public number leaks
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Inspect donor safety badges, clinical ratings & accreditation
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleQuickDemo('advocate')}
              className="bg-amber-800 py-3.5 rounded-2xl flex-row items-center justify-center shadow-sm"
            >
              <Text className="text-white font-black text-xs mr-1.5">
                Launch as Advocate Bolanle Adebayo
              </Text>
              <NavArrowRight color="#ffffff" width={14} height={14} />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'hospital' && (
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center mr-3">
                <Hospital color="#1d4ed8" width={22} height={22} strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-slate-900">
                  Hospital & Blood Bank Console
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Clinical intake, multi-stage screening & shortage broadcast
                </Text>
              </View>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Donation desk status toggle and live shortage red alerts
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Multi-stage lab screening: viral checks, hemoglobin, rating
                </Text>
              </View>
              <View className="flex-row items-center">
                <Check color="#059669" width={14} height={14} strokeWidth={3} />
                <Text className="text-xs text-slate-700 ml-2 font-medium">
                  Issue accredited Vein of Hope badges or clinical deferrals
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleQuickDemo('hospital')}
              className="bg-blue-800 py-3.5 rounded-2xl flex-row items-center justify-center shadow-sm"
            >
              <Text className="text-white font-black text-xs mr-1.5">
                Launch as LUTH Clinical Desk
              </Text>
              <NavArrowRight color="#ffffff" width={14} height={14} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Auth CTA Strip */}
      <View className="px-5 mt-6">
        <View className="bg-slate-100 border border-slate-200 rounded-3xl p-5 flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-sm font-black text-slate-900">
              Ready to Join the Lifeline?
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5">
              Create your donor, advocate, or hospital profile.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onNavigateToAuth}
            className="bg-[#990011] px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Text className="text-white font-black text-xs">Sign In / Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
