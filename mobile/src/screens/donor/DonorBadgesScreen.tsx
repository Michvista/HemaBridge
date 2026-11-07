import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
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
  bgGradient: string;
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
    accentColor: '#e11d48',
    bgGradient: '#ffe4e6',
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
    bgGradient: '#fef3c7',
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
    accentColor: '#dc2626',
    bgGradient: '#fee2e2',
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
      'Sustained lifeline resilience. Recognizes donors who return voluntarily cycle after cycle once their biological cooldown ends.',
    howToGet: 'Complete 3 verified voluntary blood donations over your donor lifecycle.',
    estimatedTime: '~9 - 12 months (respecting 3mo male / 4mo female cooldowns)',
    currentProgress: 1,
    maxProgress: 3,
    unit: 'donations completed',
    accentColor: '#64748b',
    bgGradient: '#f1f5f9',
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
    accentColor: '#f59e0b',
    bgGradient: '#fef9c3',
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
    accentColor: '#7c3aed',
    bgGradient: '#ede9fe',
    iconType: 'crown',
  },
];

export const DonorBadgesScreen: React.FC = () => {
  const [badges, setBadges] = useState<GameBadge[]>(BADGES_DATABASE);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<GameBadge | null>(null);

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
        return <Heart color={color} width={size} height={size} strokeWidth={2.5} />;
      case 'shield':
        return <Shield color={color} width={size} height={size} strokeWidth={2.5} />;
      case 'alert':
        return <WarningTriangle color={color} width={size} height={size} strokeWidth={2.5} />;
      default:
        return <Medal color={color} width={size} height={size} strokeWidth={2.5} />;
    }
  };

  const getRarityBadgeStyle = (rarity: GameBadge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' };
      case 'Epic':
        return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' };
      case 'Rare':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-black text-slate-900 tracking-tight">
          Trophy & Honours Hall
        </Text>
        <Text className="text-xs text-slate-500 mt-1">
          Track unlocked badges, game-style milestones, and humanitarian impact
        </Text>
      </View>

      {/* Game Level & Rank Banner */}
      <View className="bg-gradient-to-r bg-slate-900 rounded-3xl p-5 mb-5 shadow-lg border border-slate-800">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <View className="flex-row items-center">
              <Text className="text-amber-400 font-black text-sm tracking-widest uppercase mr-2">
                LEVEL 2 LIFESAVER
              </Text>
              <View className="bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded-full">
                <Text className="text-amber-300 text-[10px] font-black">
                  RANK: BRONZE VANGUARD
                </Text>
              </View>
            </View>
            <Text className="text-white text-lg font-black mt-1">
              {unlockedCount} of {totalCount} Badges Unlocked
            </Text>
          </View>
          <View className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 items-center justify-center">
            <Medal color="#fbbf24" width={32} height={32} strokeWidth={2.5} />
          </View>
        </View>

        {/* Level XP Progress Bar */}
        <View className="mb-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-[11px] text-slate-300 font-semibold">
              Progression to Level 3 (Silver Sentinel)
            </Text>
            <Text className="text-[11px] text-amber-400 font-bold">
              {completionPercent}% Complete
            </Text>
          </View>
          <View className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-gradient-to-r bg-amber-400 rounded-full"
              style={{ width: `${completionPercent}%` }}
            />
          </View>
        </View>

        <Text className="text-[11px] text-slate-400 leading-4 mt-1">
          Next unlock: Complete 2 more donations to earn the Silver Sentinel shield.
        </Text>
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
          const rarityStyle = getRarityBadgeStyle(badge.rarity);
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
                  : 'bg-slate-50/90 border-slate-200/80 opacity-90'
              }`}
            >
              <View className="flex-row items-start">
                {/* Badge Icon Emblem */}
                <View
                  style={{
                    backgroundColor: badge.earned ? badge.bgGradient : '#f1f5f9',
                    borderColor: badge.earned ? badge.accentColor : '#cbd5e1',
                  }}
                  className="w-14 h-14 rounded-2xl border items-center justify-center mr-3.5"
                >
                  {renderBadgeIcon(badge, 28)}
                </View>

                {/* Badge Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <View className="flex-row items-center flex-wrap gap-1">
                      <Text
                        className={`text-base font-extrabold ${
                          badge.earned ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {badge.name}
                      </Text>
                      <View
                        className={`px-1.5 py-0.5 rounded border ${rarityStyle.bg} ${rarityStyle.border}`}
                      >
                        <Text
                          className={`text-[9px] font-black uppercase ${rarityStyle.text}`}
                        >
                          {badge.rarity}
                        </Text>
                      </View>
                    </View>

                    {badge.earned ? (
                      <View className="flex-row items-center bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check color="#059669" width={11} height={11} strokeWidth={3} />
                        <Text className="text-[10px] font-extrabold text-emerald-700 ml-1">
                          EARNED
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center bg-slate-200/70 px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] font-bold text-slate-600">
                          {percent}%
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-xs text-slate-500 font-medium leading-4 mb-2">
                    {badge.tagline}
                  </Text>

                  {/* Progress Bar & Est Time */}
                  <View className="mt-1">
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
                    <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                <Text className="text-[11px] font-semibold text-rose-700">
                  Tap to view badge lore & requirements
                </Text>
                <NavArrowRight color="#be123c" width={14} height={14} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Educational Lifesaver Tips Card */}
      <View className="mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-4">
        <Text className="text-sm font-black text-rose-900 mb-1">
          Why "Vein of Hope" Recognition Matters
        </Text>
        <Text className="text-xs text-rose-800 leading-5">
          In Nigeria, less than 10% of blood needs are met by voluntary donors. Each badge
          earned verifies that you showed up for a patient in emergency crisis, maternity
          complications, or sickle-cell care. Certificates issued are accredited by hospital
          clinical desks.
        </Text>
      </View>

      {/* Game Trophy Inspection Modal */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
            {selectedBadge && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Close Bar */}
                <View className="items-center mb-4">
                  <View className="w-12 h-1 bg-slate-300 rounded-full" />
                </View>

                {/* Badge Emblem Centerpiece */}
                <View className="items-center mb-4">
                  <View
                    style={{
                      backgroundColor: selectedBadge.earned
                        ? selectedBadge.bgGradient
                        : '#f1f5f9',
                      borderColor: selectedBadge.earned
                        ? selectedBadge.accentColor
                        : '#cbd5e1',
                    }}
                    className="w-20 h-20 rounded-3xl border-2 items-center justify-center shadow-md mb-2"
                  >
                    {renderBadgeIcon(selectedBadge, 42)}
                  </View>
                  <Text className="text-xl font-black text-slate-900 text-center">
                    {selectedBadge.name}
                  </Text>
                  <Text className="text-xs text-slate-500 font-semibold text-center mt-0.5">
                    {selectedBadge.tagline}
                  </Text>
                  <View className="flex-row items-center gap-1.5 mt-2">
                    <View
                      className={`px-2 py-0.5 rounded border ${
                        getRarityBadgeStyle(selectedBadge.rarity).bg
                      } ${getRarityBadgeStyle(selectedBadge.rarity).border}`}
                    >
                      <Text
                        className={`text-[10px] font-black uppercase ${
                          getRarityBadgeStyle(selectedBadge.rarity).text
                        }`}
                      >
                        {selectedBadge.rarity} TIER {selectedBadge.level}
                      </Text>
                    </View>
                    {selectedBadge.earned ? (
                      <View className="bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                        <Text className="text-[10px] font-black text-emerald-800">
                          STATUS: UNLOCKED
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-slate-200 border border-slate-300 px-2 py-0.5 rounded">
                        <Text className="text-[10px] font-black text-slate-700">
                          STATUS: LOCKED
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* What it Represents */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3">
                  <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    What This Badge Represents
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5">
                    {selectedBadge.whatItRepresents}
                  </Text>
                </View>

                {/* How to Get it */}
                <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-3">
                  <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    How to Unlock It
                  </Text>
                  <Text className="text-xs text-slate-600 leading-5">
                    {selectedBadge.howToGet}
                  </Text>
                  <View className="flex-row items-center mt-2.5 pt-2 border-t border-slate-200">
                    <Clock color="#d97706" width={14} height={14} />
                    <Text className="text-[11px] font-semibold text-amber-900 ml-1.5">
                      Estimated Timeline: {selectedBadge.estimatedTime}
                    </Text>
                  </View>
                </View>

                {/* Progress / Verification Details */}
                {selectedBadge.earned ? (
                  <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
                    <Text className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-1">
                      Clinical Accreditation Proof
                    </Text>
                    <Text className="text-xs text-emerald-800">
                      Awarded By: <Text className="font-bold">{selectedBadge.awardedBy}</Text>
                    </Text>
                    <Text className="text-xs text-emerald-800 mt-0.5">
                      Date Issued: <Text className="font-bold">{selectedBadge.earnedDate}</Text>
                    </Text>
                    <Text className="text-xs text-emerald-800 mt-0.5">
                      Certificate ID: <Text className="font-bold font-mono">{selectedBadge.certificateId}</Text>
                    </Text>
                  </View>
                ) : (
                  <View className="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-4">
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-xs font-black text-slate-800">
                        Current Progress
                      </Text>
                      <Text className="text-xs font-bold text-slate-600">
                        {selectedBadge.currentProgress} / {selectedBadge.maxProgress} {selectedBadge.unit}
                      </Text>
                    </View>
                    <View className="h-2 bg-slate-300 rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${Math.round(
                            (selectedBadge.currentProgress / selectedBadge.maxProgress) * 100
                          )}%`,
                        }}
                        className="h-full bg-slate-800 rounded-full"
                      />
                    </View>
                  </View>
                )}

                {/* Close Button */}
                <TouchableOpacity
                  onPress={() => setSelectedBadge(null)}
                  className="bg-slate-900 py-3.5 rounded-2xl items-center justify-center mt-2"
                >
                  <Text className="text-white font-extrabold text-sm">
                    Close Hall Inspector
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
