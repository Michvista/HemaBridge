import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  PanResponder,
} from 'react-native';
import { apiClient } from '../../api/client';
import { Medal, Shield, Heart, Check, Clock, WarningTriangle, NavArrowRight } from '../../components/Icons';

interface GameBadge {
  id: string;
  code: string;
  name: string;
  tagline: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  level: number;
  earned: boolean;
  earnedDate?: string;
  awardedBy?: string;
  certificateId?: string;
  whatItRepresents: string;
  howToGet: string;
  estimatedTime: string;
  currentProgress: number;
  maxProgress: number;
  unit: string;
  accentColor: string;
  iconType: 'heart' | 'medal' | 'shield' | 'alert' | 'crown';
}

const BADGES_DATABASE: GameBadge[] = [
  {
    id: 'b1',
    code: 'first_breath',
    name: 'First Breath',
    tagline: 'Gave someone their next breath',
    rarity: 'Common',
    level: 1,
    earned: true,
    earnedDate: 'Nov 6, 2026',
    awardedBy: 'LUTH Lagos',
    certificateId: 'HB-CERT-00192',
    whatItRepresents:
      'The foundational initiation of a lifesaver. Commemorates taking the courageous first step to voluntarily donate blood for an emergency patient in Nigeria.',
    howToGet: 'Complete 1 screened, voluntary blood donation at any accredited hospital or blood drive.',
    estimatedTime: '1 clinical session (approx. 45 mins)',
    currentProgress: 1,
    maxProgress: 1,
    unit: 'donation',
    accentColor: '#be123c',
    iconType: 'heart',
  },
  {
    id: 'b2',
    code: 'vein_of_hope',
    name: 'Vein of Hope',
    tagline: 'Verified Lifesaver in Nigerian Healthcare',
    rarity: 'Rare',
    level: 2,
    earned: true,
    earnedDate: 'Nov 6, 2026',
    awardedBy: 'LUTH Lagos',
    certificateId: 'HB-CERT-00843',
    whatItRepresents:
      'The signature honour of Hemabridge. Represents clinical trust, certified viral safety markers, and active humanitarian readiness to support trauma cases.',
    howToGet: 'Awarded directly by a hospital clinical desk upon passing comprehensive lab screening and completing a verified donation.',
    estimatedTime: '1 clinical qualification cycle',
    currentProgress: 1,
    maxProgress: 1,
    unit: 'award',
    accentColor: '#d97706',
    iconType: 'medal',
  },
  {
    id: 'b3',
    code: 'emergency_vanguard',
    name: 'Emergency Vanguard',
    tagline: 'Answered a critical shortage red alert',
    rarity: 'Epic',
    level: 3,
    earned: false,
    whatItRepresents:
      'Honours frontline community courage. Bestowed on donors who answer an urgent hospital shortage broadcast when blood banks drop below zero reserves.',
    howToGet: 'Respond to an urgent Hospital Shortage Alert on the radar and donate within 3 hours of broadcast.',
    estimatedTime: '~1 emergency response call',
    currentProgress: 0,
    maxProgress: 1,
    unit: 'red alert donation',
    accentColor: '#990011',
    iconType: 'alert',
  },
  {
    id: 'b4',
    code: 'silver_sentinel',
    name: 'Silver Sentinel',
    tagline: 'Committed multi-cycle community guardian',
    rarity: 'Rare',
    level: 3,
    earned: false,
    whatItRepresents:
      'Sustained lifeline resilience. Recognizes donors who return voluntarily cycle after cycle once their recovery period completes.',
    howToGet: 'Complete 3 verified voluntary blood donations over your donor lifecycle.',
    estimatedTime: '~9 - 12 months (respecting healthy recovery windows)',
    currentProgress: 1,
    maxProgress: 3,
    unit: 'donations completed',
    accentColor: '#475569',
    iconType: 'shield',
  },
  {
    id: 'b5',
    code: 'golden_hearth',
    name: 'Golden Hearth',
    tagline: 'Anchor of maternal & pediatric surgery',
    rarity: 'Epic',
    level: 4,
    earned: false,
    whatItRepresents:
      'Direct lifesaver for high-risk childbirth trauma and complex pediatric surgeries where immediate multi-unit matching is required.',
    howToGet: 'Complete 5 verified voluntary blood donations.',
    estimatedTime: '~1.5 - 2 years of regular scheduled donations',
    currentProgress: 1,
    maxProgress: 5,
    unit: 'donations completed',
    accentColor: '#b45309',
    iconType: 'crown',
  },
  {
    id: 'b6',
    code: 'vein_of_legend',
    name: 'Vein of Legend',
    tagline: 'The supreme humanitarian order of Lagos',
    rarity: 'Legendary',
    level: 5,
    earned: false,
    whatItRepresents:
      'The highest honour a Nigerian blood donor can attain. Symbolizes saving dozens of lives and pioneering voluntary blood mobilization.',
    howToGet: 'Complete 10 verified donations and maintain a 100% clinical appointment attendance reliability record.',
    estimatedTime: '~3 - 4 years of continuous humanitarian service',
    currentProgress: 1,
    maxProgress: 10,
    unit: 'donations completed',
    accentColor: '#6d28d9',
    iconType: 'crown',
  },
];

export const DonorBadgesScreen: React.FC = () => {
  const [badges, setBadges] = useState<GameBadge[]>(BADGES_DATABASE);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<GameBadge | null>(null);

  const drawerPanResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30) {
          setSelectedBadge(null);
        }
      },
    }),
  ).current;

  const unlockedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.earned;
    if (filter === 'locked') return !b.earned;
    return true;
  });

  const renderBadgeIcon = (badge: GameBadge, size: number = 24) => {
    const color = badge.earned ? badge.accentColor : '#94a3b8';
    switch (badge.iconType) {
      case 'heart':
        return <Heart color={color} width={size} height={size} strokeWidth={2.4} />;
      case 'shield':
        return <Shield color={color} width={size} height={size} strokeWidth={2.4} />;
      case 'alert':
        return <WarningTriangle color={color} width={size} height={size} strokeWidth={2.4} />;
      default:
        return <Medal color={color} width={size} height={size} strokeWidth={2.4} />;
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-black text-slate-900 tracking-tight">
          Vein of Hope Honours Hall
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Game-style donor progression, clinical verification & lifesaver ranks
        </Text>
      </View>

      {/* Rank Progress Banner */}
      <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <View className="flex-row items-center">
              <Text className="text-[#990011] font-black text-xs uppercase tracking-wider mr-2">
                LEVEL 2 LIFESAVER
              </Text>
              <View className="bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                <Text className="text-rose-900 text-[10px] font-black">
                  BRONZE VANGUARD
                </Text>
              </View>
            </View>
            <Text className="text-slate-900 text-lg font-black mt-1">
              {unlockedCount} of {totalCount} Badges Unlocked
            </Text>
          </View>

          <View className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 items-center justify-center">
            <Medal color="#d97706" width={26} height={26} strokeWidth={2.4} />
          </View>
        </View>

        {/* Progress Bar */}
        <View className="mb-1">
          <View className="flex-row justify-between mb-1">
            <Text className="text-[11px] text-slate-500 font-semibold">
              Progression to Silver Sentinel
            </Text>
            <Text className="text-[11px] text-slate-800 font-bold">
              {completionPercent}%
            </Text>
          </View>
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-[#990011] rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row bg-slate-200/80 p-1 rounded-2xl mb-4">
        {(['all', 'unlocked', 'locked'] as const).map((tab) => {
          const isActive = filter === tab;
          const label =
            tab === 'all'
              ? `All (${totalCount})`
              : tab === 'unlocked'
              ? `Unlocked (${unlockedCount})`
              : `Locked (${totalCount - unlockedCount})`;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              className={`flex-1 py-2 rounded-xl items-center justify-center ${
                isActive ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isActive ? 'text-slate-900' : 'text-slate-600'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Badges List */}
      <View className="space-y-3">
        {filteredBadges.map((badge) => {
          const percent = Math.min(
            100,
            Math.round((badge.currentProgress / badge.maxProgress) * 100)
          );

          return (
            <TouchableOpacity
              key={badge.id}
              activeOpacity={0.85}
              onPress={() => setSelectedBadge(badge)}
              className={`rounded-2xl p-4 border shadow-sm ${
                badge.earned
                  ? 'bg-white border-slate-200'
                  : 'bg-white/80 border-slate-200/60'
              }`}
            >
              <View className="flex-row items-start">
                {/* Emblem */}
                <View
                  style={{
                    backgroundColor: badge.earned ? '#fff1f2' : '#f8fafc',
                    borderColor: badge.earned ? badge.accentColor : '#e2e8f0',
                  }}
                  className="w-13 h-13 rounded-2xl border items-center justify-center mr-3.5 p-2.5"
                >
                  {renderBadgeIcon(badge, 26)}
                </View>

                {/* Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <View className="flex-row items-center flex-wrap gap-1">
                      <Text className="text-sm font-black text-slate-900">
                        {badge.name}
                      </Text>
                      <View className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        <Text className="text-[9px] font-black uppercase text-slate-700">
                          {badge.rarity}
                        </Text>
                      </View>
                    </View>

                    {badge.earned ? (
                      <View className="flex-row items-center bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check color="#059669" width={10} height={10} strokeWidth={3} />
                        <Text className="text-[9px] font-black text-emerald-800 ml-1">
                          EARNED
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-[10px] font-bold text-slate-500">
                        {percent}%
                      </Text>
                    )}
                  </View>

                  <Text className="text-xs text-slate-500 font-medium leading-4 mb-2">
                    {badge.tagline}
                  </Text>

                  {/* Progress & Time */}
                  <View>
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-[10px] font-bold text-slate-600">
                        {badge.currentProgress} / {badge.maxProgress} {badge.unit}
                      </Text>
                      <View className="flex-row items-center">
                        <Clock color="#94a3b8" width={10} height={10} />
                        <Text className="text-[10px] text-slate-500 ml-1">
                          {badge.estimatedTime.split('(')[0].trim()}
                        </Text>
                      </View>
                    </View>
                    <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${percent}%`,
                          backgroundColor: badge.earned ? badge.accentColor : '#64748b',
                        }}
                        className="h-full rounded-full"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                <Text className="text-[11px] font-semibold text-[#990011]">
                  View badge lore & requirements
                </Text>
                <NavArrowRight color="#990011" width={13} height={13} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Trophy Inspection Drawer Modal */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedBadge(null)}
          className="flex-1 bg-black/60 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-5 max-h-[82%]"
          >
            {selectedBadge && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Drag Drawer Handle */}
                <View
                  {...drawerPanResponder.panHandlers}
                  className="items-center py-2 mb-2"
                >
                  <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
                  <Text className="text-[10px] text-slate-400 font-medium mt-1">
                    Drag down or tap backdrop to close
                  </Text>
                </View>

                <View className="items-center mb-3">
                  <View
                    style={{
                      backgroundColor: selectedBadge.earned ? '#fff1f2' : '#f8fafc',
                      borderColor: selectedBadge.earned ? selectedBadge.accentColor : '#cbd5e1',
                    }}
                    className="w-18 h-18 rounded-3xl border-2 items-center justify-center p-3 mb-2"
                  >
                    {renderBadgeIcon(selectedBadge, 36)}
                  </View>

                  <Text className="text-lg font-black text-slate-900">
                    {selectedBadge.name}
                  </Text>
                  <Text className="text-xs text-slate-500 font-semibold mt-0.5">
                    {selectedBadge.tagline}
                  </Text>
                </View>

                {/* What it represents */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3">
                  <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    What This Badge Represents
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5">
                    {selectedBadge.whatItRepresents}
                  </Text>
                </View>

                {/* How to unlock */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3">
                  <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    How to Unlock It
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5">
                    {selectedBadge.howToGet}
                  </Text>
                  <View className="flex-row items-center mt-2.5 pt-2 border-t border-slate-200">
                    <Clock color="#b45309" width={13} height={13} />
                    <Text className="text-[11px] font-semibold text-amber-900 ml-1.5">
                      Estimated Timeline: {selectedBadge.estimatedTime}
                    </Text>
                  </View>
                </View>

                {/* Accreditation Details if earned */}
                {selectedBadge.earned && (
                  <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
                    <Text className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-1">
                      Clinical Accreditation Proof
                    </Text>
                    <Text className="text-xs text-emerald-800">
                      Awarded By: <Text className="font-bold">{selectedBadge.awardedBy}</Text>
                    </Text>
                    <Text className="text-xs text-emerald-800 mt-0.5">
                      Certificate ID: <Text className="font-bold font-mono">{selectedBadge.certificateId}</Text>
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setSelectedBadge(null)}
                  className="bg-slate-900 py-3.5 rounded-2xl items-center shadow mt-1"
                >
                  <Text className="text-white font-black text-xs">
                    Close Inspector
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};
