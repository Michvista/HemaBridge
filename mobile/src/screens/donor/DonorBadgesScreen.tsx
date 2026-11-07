import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { apiClient } from '../../api/client';
import { Medal, Shield, Heart, Check } from '../../components/Icons';

export const DonorBadgesScreen: React.FC = () => {
  const [badgeData, setBadgeData] = useState<any>({
    totalEarned: 1,
    badges: [],
  });

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const res = await apiClient.get('/badges/my-collection');
      setBadgeData(res.data);
    } catch (err) {
      console.log('Error loading badges:', err);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-slate-900">
          Vein of Hope Honours
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Recognition badges, life-saver milestones, and blood donation impact
        </Text>
      </View>

      {/* Featured Badge Card */}
      <View className="bg-gradient-to-r bg-rose-950 rounded-3xl p-5 mb-5 shadow-lg">
        <View className="flex-row items-center mb-3">
          <View className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 items-center justify-center mr-3.5">
            <Medal color="#fbbf24" height={30} width={30} strokeWidth={2.5} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-white font-black text-lg mr-2">
                Vein of Hope
              </Text>
              <View className="bg-amber-400 px-2 py-0.5 rounded-full">
                <Text className="text-slate-950 text-[10px] font-black">
                  ACTIVE
                </Text>
              </View>
            </View>
            <Text className="text-rose-200 text-xs mt-0.5">
              Verified Lifesaver in Nigerian Healthcare
            </Text>
          </View>
        </View>

        <Text className="text-xs text-white/80 leading-5">
          "Every drop counts. Awarded for completing screened, verified voluntary donations at accredited healthcare facilities in Lagos."
        </Text>

        <View className="flex-row items-center justify-between pt-3 border-t border-white/10 mt-3">
          <Text className="text-[11px] text-rose-300 font-medium">
            Clinical Verification: <Text className="text-white font-bold">LUTH Accredited</Text>
          </Text>
          <Text className="text-[11px] text-amber-300 font-bold">1 Award Earned</Text>
        </View>
      </View>

      {/* Badge Progression Grid */}
      <Text className="text-base font-extrabold text-slate-900 mb-2">
        Badge Progression
      </Text>

      <View className="space-y-3 mb-5">
        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-amber-50 items-center justify-center mr-3 border border-amber-100">
            <Medal color="#d97706" height={24} width={24} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-extrabold text-slate-900 text-sm">
                Vein of Hope
              </Text>
              <Text className="text-[11px] font-bold text-emerald-600">Earned</Text>
            </View>
            <Text className="text-xs text-slate-500 mt-0.5">
              1st voluntary donation completed under clinical supervision.
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center opacity-70">
          <View className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center mr-3 border border-slate-200">
            <Shield color="#94a3b8" height={24} width={24} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-extrabold text-slate-800 text-sm">
                Rapid Responder
              </Text>
              <Text className="text-[11px] font-bold text-slate-400">Locked (1/2)</Text>
            </View>
            <Text className="text-xs text-slate-500 mt-0.5">
              Fulfill 2 emergency requests within 2 hours of broadcast.
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-row items-center opacity-70">
          <View className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center mr-3 border border-slate-200">
            <Heart color="#94a3b8" height={24} width={24} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-extrabold text-slate-800 text-sm">
                Community Guardian
              </Text>
              <Text className="text-[11px] font-bold text-slate-400">Locked (1/3)</Text>
            </View>
            <Text className="text-xs text-slate-500 mt-0.5">
              Consistent voluntary blood donor with 3+ donations.
            </Text>
          </View>
        </View>
      </View>

      {/* Awareness & Educational Section */}
      <Text className="text-base font-extrabold text-slate-900 mb-2">
        Awareness & Safety in Nigeria
      </Text>

      <View className="bg-rose-50 rounded-2xl p-4 border border-rose-100 mb-6">
        <Text className="font-extrabold text-rose-900 text-sm mb-1">
          Did You Know?
        </Text>
        <Text className="text-xs text-rose-800 leading-5">
          One unit of donated blood can save up to 3 lives: accident victims, mothers during complicated childbirth, and children managing sickle cell anaemia crises across Lagos hospitals.
        </Text>
      </View>
    </ScrollView>
  );
};
