import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Heart, User, Hospital, Shield, NavArrowRight } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';

interface AuthScreenProps {
  onBackToIntro: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBackToIntro }) => {
  const { login, switchPersona } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'donor' | 'advocate' | 'hospital'>('donor');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const handleQuickLogin = (role: 'donor' | 'advocate' | 'hospital') => {
    switchPersona(role);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await apiClient.post('/auth/login', { email, password });
        if (res.data && res.data.token && res.data.user) {
          login(res.data.token, res.data.user);
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }

        const payload: any = {
          email,
          password,
          name,
          phone: phone || '+234 800 000 0000',
          role: selectedRole,
        };

        if (selectedRole === 'donor') {
          payload.bloodType = bloodType;
          payload.gender = 'female';
        } else if (selectedRole === 'hospital') {
          payload.operatingLicence = 'MOH-VERIFIED';
        }

        const res = await apiClient.post('/auth/register', payload);
        if (res.data && res.data.token && res.data.user) {
          login(res.data.token, res.data.user);
        }
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Unable to complete request. Please check your network or try Quick Login.';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBackToIntro}
          className="self-start py-2 px-3.5 rounded-full bg-white border border-slate-200 mb-4 shadow-sm"
        >
          <Text className="text-xs font-bold text-slate-700">← Back</Text>
        </TouchableOpacity>

        {/* Brand Header */}
        <View className="mb-5">
          <View className="flex-row items-center mb-1">
            <View className="w-8 h-8 rounded-xl bg-[#990011] items-center justify-center mr-2">
              <Heart color="#ffffff" width={16} height={16} strokeWidth={2.5} />
            </View>
            <Text className="text-xl font-black text-slate-900">HemaBridge</Text>
          </View>
          <Text className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </Text>
          <Text className="text-xs text-slate-500 font-medium mt-0.5">
            {mode === 'login'
              ? 'Sign in to access your blood donor, advocate, or hospital console'
              : 'Join the emergency blood lifeline network'}
          </Text>
        </View>

        {/* Mode Switch (Sign In / Register) */}
        <View className="flex-row bg-slate-200/80 p-1 rounded-2xl mb-4">
          <TouchableOpacity
            onPress={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              mode === 'login' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-black ${
                mode === 'login' ? 'text-slate-900' : 'text-slate-600'
              }`}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
              mode === 'register' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-xs font-black ${
                mode === 'register' ? 'text-slate-900' : 'text-slate-600'
              }`}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Roles */}
        <View className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
            Quick Login
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleQuickLogin('donor')}
              className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center"
            >
              <Heart color="#990011" width={14} height={14} strokeWidth={2.5} />
              <Text className="text-xs font-black text-slate-800 mt-1">
                Amara (O+)
              </Text>
              <Text className="text-[10px] text-slate-400">Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickLogin('advocate')}
              className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center"
            >
              <User color="#b45309" width={14} height={14} strokeWidth={2.5} />
              <Text className="text-xs font-black text-slate-800 mt-1">
                Bolanle
              </Text>
              <Text className="text-[10px] text-slate-400">Advocate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleQuickLogin('hospital')}
              className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-2 rounded-xl items-center"
            >
              <Hospital color="#047857" width={14} height={14} strokeWidth={2.5} />
              <Text className="text-xs font-black text-slate-800 mt-1">
                LUTH
              </Text>
              <Text className="text-[10px] text-slate-400">Hospital</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Container */}
        <View className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-5">
          {errorMsg && (
            <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4">
              <Text className="text-xs font-bold text-rose-800">{errorMsg}</Text>
            </View>
          )}

          {/* Role Selector (in Register mode) */}
          {mode === 'register' && (
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1.5">
                Select Your Role
              </Text>
              <View className="flex-row gap-2">
                {(
                  [
                    { id: 'donor', label: 'Donor', icon: Heart },
                    { id: 'advocate', label: 'Advocate', icon: User },
                    { id: 'hospital', label: 'Hospital', icon: Hospital },
                  ] as const
                ).map((r) => {
                  const isSel = selectedRole === r.id;
                  const Icon = r.icon;
                  return (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => setSelectedRole(r.id)}
                      className={`flex-1 py-2 rounded-xl border flex-row items-center justify-center gap-1 ${
                        isSel
                          ? 'bg-slate-900 border-slate-900'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Icon
                        color={isSel ? '#ffffff' : '#64748b'}
                        width={13}
                        height={13}
                      />
                      <Text
                        className={`text-xs font-extrabold ${
                          isSel ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Name Field (Register Mode) */}
          {mode === 'register' && (
            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-700 mb-1">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
              />
            </View>
          )}

          {/* Email Field */}
          <View className="mb-3">
            <Text className="text-xs font-bold text-slate-700 mb-1">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. amara@hemabridge.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
            />
          </View>

          {/* Password Field */}
          <View className="mb-3">
            <Text className="text-xs font-bold text-slate-700 mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
            />
          </View>

          {/* Blood Type Selector (Donor Register Mode) */}
          {mode === 'register' && selectedRole === 'donor' && (
            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-700 mb-1.5 text-center">
                Blood Group (ABO & Rhesus)
              </Text>
              <View className="flex-row flex-wrap justify-center gap-1.5">
                {bloodTypes.map((bt) => {
                  const isSel = bloodType === bt;
                  return (
                    <TouchableOpacity
                      key={bt}
                      onPress={() => setBloodType(bt)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isSel
                          ? 'bg-[#990011] border-[#990011]'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text
                        className={`text-xs font-black ${
                          isSel ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {bt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Phone (Register Mode) */}
          {mode === 'register' && (
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+234 803 123 4567"
                keyboardType="phone-pad"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium"
              />
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={loading}
            className="bg-[#990011] py-3.5 rounded-full items-center justify-center shadow-md mt-2"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text className="text-white font-black text-xs">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
