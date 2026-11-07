import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Heart, Hospital, User as UserIcon, Shield, NavArrowRight } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';

interface IntroProps {
  onNavigateToAuth: () => void;
}

const { width, height } = Dimensions.get('window');

export const IntroWelcomeScreen: React.FC<IntroProps> = ({ onNavigateToAuth }) => {
  const { switchPersona } = useAuth();

  return (
    <View className="flex-1 bg-[#990011]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Half: Crimson Background with Centered Arched Visual */}
        <View className="items-center justify-center pt-8 pb-6 px-6">
          {/* Arched Illustration Window matching reference design */}
          <View
            style={{ width: Math.min(width * 0.65, 260), height: Math.min(height * 0.38, 280) }}
            className="rounded-t-full rounded-b-[40px] bg-rose-950/40 border-2 border-white/20 items-center justify-center overflow-hidden shadow-2xl relative"
          >
            {/* Soft ambient radial glow */}
            <View className="w-48 h-48 rounded-full bg-white/10 absolute top-4 items-center justify-center" />

            {/* Central Blood Donation Graphic */}
            <View className="w-24 h-24 rounded-full bg-white/15 border border-white/30 items-center justify-center shadow-lg">
              <Heart color="#ffffff" width={48} height={48} strokeWidth={2.2} />
            </View>

            <View className="mt-4 px-4 items-center">
              <Text className="text-white/90 text-xs font-bold text-center tracking-wide">
                HemaBridge Nigeria
              </Text>
              <Text className="text-rose-200/80 text-[10px] text-center mt-0.5">
                Every donor is a hope for someone's next breath
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Half: Rounded White Card Container */}
        <View className="flex-1 bg-white rounded-t-[36px] px-6 pt-8 pb-10 shadow-2xl justify-between">
          <View className="items-center">
            {/* Headline matching reference image */}
            <Text className="text-3xl font-black text-slate-900 text-center tracking-tight leading-8">
              Donate Blood{'\n'}Save Life!
            </Text>

            {/* Subtitle matching reference style */}
            <Text className="text-xs sm:text-sm text-slate-500 font-medium text-center mt-3 max-w-xs leading-5">
              An award-winning digital blood bridge across Nigeria. We connect voluntary donors, patients in urgent need, and hospital blood banks in minutes.
            </Text>
          </View>

          {/* Action CTAs */}
          <View className="mt-6 space-y-2.5">
            {/* Donate Now Button matching reference photo */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onNavigateToAuth}
              className="w-full bg-[#990011] py-4 rounded-full items-center justify-center shadow-md active:opacity-90"
            >
              <Text className="text-white font-black text-sm tracking-wide">
                Donate Now
              </Text>
            </TouchableOpacity>

            {/* Sign In & Log In Options */}
            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onNavigateToAuth}
                className="flex-1 bg-slate-100 border border-slate-300 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-slate-800 font-extrabold text-xs">
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onNavigateToAuth}
                className="flex-1 bg-rose-50 border border-rose-200 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-[#990011] font-extrabold text-xs">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Personas for Quick Exploration */}
            <View className="pt-3">
              <Text className="text-[10px] font-black text-slate-400 text-center uppercase tracking-wider mb-2">
                Or Try Instant Demo Access
              </Text>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => switchPersona('donor')}
                  className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-1 rounded-2xl items-center shadow-xs"
                >
                  <Heart color="#990011" width={16} height={16} strokeWidth={2.4} />
                  <Text className="text-xs font-black text-slate-800 mt-1">
                    Donor
                  </Text>
                  <Text className="text-[10px] text-slate-400">Amara (O+)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => switchPersona('advocate')}
                  className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-1 rounded-2xl items-center shadow-xs"
                >
                  <UserIcon color="#b45309" width={16} height={16} strokeWidth={2.4} />
                  <Text className="text-xs font-black text-slate-800 mt-1">
                    Advocate
                  </Text>
                  <Text className="text-[10px] text-slate-400">Bolanle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => switchPersona('hospital')}
                  className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-1 rounded-2xl items-center shadow-xs"
                >
                  <Hospital color="#047857" width={16} height={16} strokeWidth={2.4} />
                  <Text className="text-xs font-black text-slate-800 mt-1">
                    Hospital
                  </Text>
                  <Text className="text-[10px] text-slate-400">LUTH</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
