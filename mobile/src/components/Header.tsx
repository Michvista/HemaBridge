import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Heart, Hospital, User as UserIcon, Refresh } from './Icons';

export const Header: React.FC = () => {
  const { user, role, quickSwitchRole, isLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case UserRole.DONOR:
        return {
          label: 'Donor Hub',
          bg: 'bg-rose-100',
          text: 'text-rose-900',
          border: 'border-rose-300',
        };
      case UserRole.ADVOCATE:
        return {
          label: 'Patient Advocate',
          bg: 'bg-amber-100',
          text: 'text-amber-900',
          border: 'border-amber-300',
        };
      case UserRole.HOSPITAL:
        return {
          label: 'Hospital Portal',
          bg: 'bg-emerald-100',
          text: 'text-emerald-900',
          border: 'border-emerald-300',
        };
      default:
        return {
          label: 'Hemabridge',
          bg: 'bg-slate-100',
          text: 'text-slate-800',
          border: 'border-slate-300',
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <View className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 shadow-sm">
      <View className="flex-row items-center justify-between">
        {/* Brand */}
        <View>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-rose-700 items-center justify-center mr-2 shadow-sm">
              <Heart color="#ffffff" height={18} width={18} strokeWidth={2.5} />
            </View>
            <Text className="text-xl font-extrabold tracking-tight">
              <Text className="text-rose-700">Hema</Text>
              <Text className="text-slate-900">bridge</Text>
            </Text>
          </View>
          <Text className="text-[10px] text-slate-500 font-medium mt-0.5">
            Every donor is a hope for someone's next breath
          </Text>
        </View>

        {/* Role Selector Pill */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className={`flex-row items-center px-2.5 py-1.5 rounded-full border ${badge.bg} ${badge.border}`}
        >
          <Text className={`text-xs font-semibold mr-1.5 ${badge.text}`}>
            {badge.label}
          </Text>
          <Refresh color="#475569" height={13} width={13} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Role Switcher Modal for Pair-Programming & Testing */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center px-4"
        >
          <View className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <Text className="text-lg font-bold text-slate-900 mb-1">
              Switch User Perspective
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Instantly test the app as a Donor, Patient Advocate, or Hospital official:
            </Text>

            {/* Donor Option */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={async () => {
                await quickSwitchRole(UserRole.DONOR);
                setModalVisible(false);
              }}
              className={`p-3.5 mb-2.5 rounded-xl border flex-row items-center ${
                role === UserRole.DONOR
                  ? 'border-rose-600 bg-rose-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center mr-3">
                <Heart color="#be123c" height={20} width={20} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-slate-900">Amara Miller (Donor)</Text>
                <Text className="text-xs text-slate-500">
                  Blood Type O+ • Ikeja, Lagos • Available
                </Text>
              </View>
            </TouchableOpacity>

            {/* Advocate Option */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={async () => {
                await quickSwitchRole(UserRole.ADVOCATE);
                setModalVisible(false);
              }}
              className={`p-3.5 mb-2.5 rounded-xl border flex-row items-center ${
                role === UserRole.ADVOCATE
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-3">
                <UserIcon color="#b45309" height={20} width={20} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-slate-900">
                  Bolanle Adebayo (Advocate)
                </Text>
                <Text className="text-xs text-slate-500">
                  Patient Relative • Requesting O+ blood
                </Text>
              </View>
            </TouchableOpacity>

            {/* Hospital Option */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={async () => {
                await quickSwitchRole(UserRole.HOSPITAL);
                setModalVisible(false);
              }}
              className={`p-3.5 mb-3 rounded-xl border flex-row items-center ${
                role === UserRole.HOSPITAL
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
                <Hospital color="#047857" height={20} width={20} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-slate-900">
                  LUTH (Hospital Portal)
                </Text>
                <Text className="text-xs text-slate-500">
                  Idi-Araba, Surulere • Donation Desk Open
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="py-2.5 items-center justify-center"
            >
              <Text className="text-slate-500 font-semibold text-xs">Dismiss</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
