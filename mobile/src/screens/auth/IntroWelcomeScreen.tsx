import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Heart, Hospital, User as UserIcon, Shield, NavArrowRight } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { BouncyPressable, PulseBeacon } from '../../components/MicroInteractions';

interface IntroProps {
  onNavigateToAuth: () => void;
}

const { width, height } = Dimensions.get('window');

export const IntroWelcomeScreen: React.FC<IntroProps> = ({ onNavigateToAuth }) => {
  const { switchPersona, isLoading } = useAuth();
  const [loadingPersona, setLoadingPersona] = useState<'donor' | 'advocate' | 'hospital' | null>(null);

  const handleSwitchPersona = async (persona: 'donor' | 'advocate' | 'hospital') => {
    if (loadingPersona) return;
    setLoadingPersona(persona);
    try {
      await switchPersona(persona);
    } finally {
      setLoadingPersona(null);
    }
  };

  return (
    <View className="flex-1 bg-[#b91c1c]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Half: Crimson Background with Centered Arched Visual Window */}
        <View className="items-center justify-center pt-8 pb-5 px-6">
          <View
            style={{
              width: Math.min(width * 0.72, 280),
              height: Math.min(height * 0.36, 280),
              borderTopLeftRadius: 140,
              borderTopRightRadius: 140,
              borderBottomLeftRadius: 36,
              borderBottomRightRadius: 36,
            }}
            className="overflow-hidden border-2 border-white/30 shadow-2xl bg-rose-900 relative"
          >
            <Image
              source={require('../../../assets/welcome_hero.jpg')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
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
            <BouncyPressable
              onPress={onNavigateToAuth}
              disabled={!!loadingPersona}
              className="w-full bg-[#b91c1c] py-4 rounded-full items-center justify-center shadow-md active:opacity-90"
            >
              <Text className="text-white font-black text-sm tracking-wide">
                Donate Now
              </Text>
            </BouncyPressable>

            {/* Sign In & Log In Options */}
            <View className="flex-row gap-2 mt-2">
              <BouncyPressable
                onPress={onNavigateToAuth}
                disabled={!!loadingPersona}
                className="flex-1 bg-slate-100 border border-slate-300 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-slate-800 font-extrabold text-xs">
                  Sign In
                </Text>
              </BouncyPressable>

              <BouncyPressable
                onPress={onNavigateToAuth}
                disabled={!!loadingPersona}
                className="flex-1 bg-rose-50 border border-rose-200 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-[#990011] font-extrabold text-xs">
                  Create Account
                </Text>
              </BouncyPressable>
            </View>

            {/* Demo Personas for Quick Exploration */}
            <View className="pt-3">
              <View className="flex-row items-center justify-center mb-2.5 space-x-1.5">
                <PulseBeacon color="#059669" size={6} />
                <Text className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Live Cloud Persona Demo
                </Text>
              </View>

              <View className="flex-row gap-2">
                <BouncyPressable
                  onPress={() => handleSwitchPersona('donor')}
                  disabled={!!loadingPersona}
                  className={`flex-1 bg-slate-50 border py-2.5 px-1 rounded-2xl items-center shadow-xs ${
                    loadingPersona === 'donor'
                      ? 'border-[#990011] bg-rose-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  {loadingPersona === 'donor' ? (
                    <View className="py-2 items-center">
                      <ActivityIndicator size="small" color="#990011" />
                      <Text className="text-[9px] font-bold text-[#990011] mt-1">Connecting</Text>
                    </View>
                  ) : (
                    <>
                      <Heart color="#990011" width={16} height={16} strokeWidth={2.4} />
                      <Text className="text-xs font-black text-slate-800 mt-1">
                        Donor
                      </Text>
                      <Text className="text-[10px] text-slate-400">Amara (O+)</Text>
                    </>
                  )}
                </BouncyPressable>

                <BouncyPressable
                  onPress={() => handleSwitchPersona('advocate')}
                  disabled={!!loadingPersona}
                  className={`flex-1 bg-slate-50 border py-2.5 px-1 rounded-2xl items-center shadow-xs ${
                    loadingPersona === 'advocate'
                      ? 'border-amber-600 bg-amber-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  {loadingPersona === 'advocate' ? (
                    <View className="py-2 items-center">
                      <ActivityIndicator size="small" color="#b45309" />
                      <Text className="text-[9px] font-bold text-amber-700 mt-1">Connecting</Text>
                    </View>
                  ) : (
                    <>
                      <UserIcon color="#b45309" width={16} height={16} strokeWidth={2.4} />
                      <Text className="text-xs font-black text-slate-800 mt-1">
                        Advocate
                      </Text>
                      <Text className="text-[10px] text-slate-400">Bolanle</Text>
                    </>
                  )}
                </BouncyPressable>

                <BouncyPressable
                  onPress={() => handleSwitchPersona('hospital')}
                  disabled={!!loadingPersona}
                  className={`flex-1 bg-slate-50 border py-2.5 px-1 rounded-2xl items-center shadow-xs ${
                    loadingPersona === 'hospital'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-200'
                  }`}
                >
                  {loadingPersona === 'hospital' ? (
                    <View className="py-2 items-center">
                      <ActivityIndicator size="small" color="#047857" />
                      <Text className="text-[9px] font-bold text-emerald-700 mt-1">Connecting</Text>
                    </View>
                  ) : (
                    <>
                      <Hospital color="#047857" width={16} height={16} strokeWidth={2.4} />
                      <Text className="text-xs font-black text-slate-800 mt-1">
                        Hospital
                      </Text>
                      <Text className="text-[10px] text-slate-400">LUTH</Text>
                    </>
                  )}
                </BouncyPressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
