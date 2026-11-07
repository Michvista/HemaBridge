import React from 'react';
import { View, Text } from 'react-native';
import { Clock, Check, Shield } from './Icons';

interface CooldownWidgetProps {
  daysRemaining: number;
  intervalMonths: number;
  eligible: boolean;
  gender: string;
}

export const CooldownWidget: React.FC<CooldownWidgetProps> = ({
  daysRemaining,
  intervalMonths,
  eligible,
  gender,
}) => {
  const totalDays = intervalMonths * 30;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((totalDays - daysRemaining) / totalDays) * 100)),
  );

  return (
    <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-rose-50 items-center justify-center mr-2">
            <Clock color="#be123c" height={18} width={18} strokeWidth={2} />
          </View>
          <View>
            <Text className="text-sm font-bold text-slate-900">
              Donation Recovery Period
            </Text>
            <Text className="text-[11px] text-slate-500">
              {gender === 'male' ? '90-day recovery cycle' : '120-day recovery cycle'}
            </Text>
          </View>
        </View>

        {eligible ? (
          <View className="flex-row items-center bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check color="#059669" height={13} width={13} strokeWidth={2.5} />
            <Text className="text-[11px] font-bold text-emerald-700 ml-1">
              Eligible to Donate
            </Text>
          </View>
        ) : (
          <View className="bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Text className="text-[11px] font-bold text-amber-700">
              {daysRemaining} Days Left
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
        <View
          style={{ width: `${progressPercent}%` }}
          className={`h-full rounded-full ${
            eligible ? 'bg-emerald-500' : 'bg-[#990011]'
          }`}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] text-slate-400">
          {progressPercent}% completed
        </Text>
        <Text className="text-[11px] text-slate-600 font-medium">
          {eligible
            ? 'Fully recovered for next donation'
            : `Next safe donation in ${daysRemaining} days`}
        </Text>
      </View>
    </View>
  );
};
