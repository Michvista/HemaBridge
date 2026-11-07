import React from 'react';
import { View, Text } from 'react-native';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'accepted':
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'emergency':
      case 'declined':
      case 'cancelled':
      case 'closed':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'pending':
      case 'urgent':
      case 'screening_scheduled':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const style = getStyle();
  const formatted =
    status === 'screening_scheduled'
      ? 'Screening Set'
      : status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

  return (
    <View
      className={`flex-row items-center px-2 py-0.5 rounded-full border ${style.bg} ${style.border}`}
    >
      <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${style.dot}`} />
      <Text className={`text-[11px] font-bold ${style.text}`}>{formatted}</Text>
    </View>
  );
};
