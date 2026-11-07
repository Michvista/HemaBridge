import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../../api/client';
import { DonorApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Hospital,
  Clock,
  ChatBubble,
  Check,
  Medal,
  Shield,
  WarningTriangle,
} from '../../components/Icons';

export const HospitalQueueScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Scheduling Modal State
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [screeningDate, setScreeningDate] = useState<string>('2026-11-12');
  const [screeningTime, setScreeningTime] = useState<string>('10:00');
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState<boolean>(false);

  // Multi-Stage Clinical Screening Lab Modal State
  const [labEvalApp, setLabEvalApp] = useState<any | null>(null);
  const [evalDecision, setEvalDecision] = useState<'passed' | 'failed'>('passed');
  const [hemoglobin, setHemoglobin] = useState<string>('13.8');
  const [hivClear, setHivClear] = useState<boolean>(true);
  const [hepBClear, setHepBClear] = useState<boolean>(true);
  const [syphilisClear, setSyphilisClear] = useState<boolean>(true);
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');
  const [hospitalRating, setHospitalRating] = useState<number>(5);
  const [clinicalFeedback, setClinicalFeedback] = useState<string>(
    'Optimal donor health. Zero transmissible viral markers detected. Highly cooperative voluntary donor.',
  );
  const [deferralReason, setDeferralReason] = useState<string>(
    'Hemoglobin below 12.5 g/dL threshold. Advised 30 days iron-rich dietary intake.',
  );
  const [unitsCollected, setUnitsCollected] = useState<number>(1);
  const [isSubmittingEval, setIsSubmittingEval] = useState<boolean>(false);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const res = await apiClient.get('/applications/hospital-queue');
      setQueue(res.data);
    } catch (err) {
      console.log('Error loading queue:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleScheduleScreening = async () => {
    if (!selectedApp) return;
    try {
      await apiClient.patch(`/applications/${selectedApp.id}/schedule-screening`, {
        screeningDate,
        screeningTime,
      });
      setIsScheduleModalVisible(false);
      Alert.alert(
        'Screening Scheduled',
        `Appointment set for ${selectedApp.donor?.name} on ${screeningDate} at ${screeningTime}. Donor notified.`,
      );
      loadQueue();
    } catch (err) {
      Alert.alert('Error', 'Unable to schedule appointment.');
    }
  };

  const handleOpenEvaluationModal = (app: any) => {
    setLabEvalApp(app);
    setEvalDecision('passed');
    setHospitalRating(5);
    setHemoglobin('13.8');
    setHivClear(true);
    setHepBClear(true);
    setSyphilisClear(true);
  };

  const handleSubmitEvaluation = async () => {
    if (!labEvalApp) return;
    setIsSubmittingEval(true);

    try {
      const payload = {
        decision: evalDecision,
        hemoglobin: `${hemoglobin} g/dL`,
        viralScreeningClear: evalDecision === 'passed' && hivClear && hepBClear && syphilisClear,
        rating: hospitalRating,
        unitsCollected: evalDecision === 'passed' ? unitsCollected : 0,
        ratingFeedback: evalDecision === 'passed' ? clinicalFeedback : deferralReason,
        clinicalNotes:
          evalDecision === 'passed'
            ? `Viral markers: Non-Reactive (HIV, HepB, Syphilis). Hb: ${hemoglobin} g/dL. BP: ${bloodPressure}. Ready for transfusion.`
            : `Screening Deferred: ${deferralReason}. Blood not drawn.`,
      };

      await apiClient.post(`/applications/${labEvalApp.id}/evaluate`, payload);

      setLabEvalApp(null);
      Alert.alert(
        evalDecision === 'passed' ? 'Donation Confirmed & Awarded' : 'Screening Deferred',
        evalDecision === 'passed'
          ? `Lab confirmed safe blood collection. ${hospitalRating}★ rating and "Vein of Hope" badge awarded to ${labEvalApp.donor?.name}!`
          : `Donor marked as deferred. Record logged with ${hospitalRating}★ rating and no badge issued.`,
      );
      loadQueue();
    } catch (err) {
      Alert.alert('Error', 'Failed to submit clinical screening evaluation.');
    } finally {
      setIsSubmittingEval(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50 p-4"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadQueue();
          }}
        />
      }
    >
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-black text-slate-900 tracking-tight">
          Clinical Donor Intake Queue
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          Multi-stage clinical screening, viral lab validation & honours awarding
        </Text>
      </View>

      {/* Queue Cards */}
      <View className="space-y-3">
        {queue.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 border border-slate-200 items-center justify-center">
            <Hospital color="#94a3b8" width={28} height={28} />
            <Text className="text-sm font-black text-slate-800 mt-2">
              Queue is Clear
            </Text>
            <Text className="text-xs text-slate-500 text-center mt-1">
              No donors currently awaiting screening or clinical intake.
            </Text>
          </View>
        ) : (
          queue.map((app) => {
            const donor = app.donor;
            const dp = donor?.donorProfile;
            const isCompleted = app.status === ApplicationStatus.COMPLETED;
            const isDeclined = app.status === ApplicationStatus.DECLINED;
            const isScheduled = app.status === ApplicationStatus.SCREENING_SCHEDULED;
            const isPending = app.status === ApplicationStatus.PENDING;

            return (
              <View
                key={app.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm"
              >
                {/* Donor Header */}
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 items-center justify-center mr-3">
                      <Hospital color="#047857" width={20} height={20} />
                    </View>
                    <View>
                      <Text className="font-black text-slate-900 text-sm">
                        {donor?.name || 'Voluntary Donor'}
                      </Text>
                      <Text className="text-xs text-slate-500 mt-0.5">
                        Group <Text className="font-bold text-slate-800">{app.bloodType}</Text> • {dp?.gender === 'female' ? 'Female' : 'Male'} • {dp?.area || 'Lagos'}
                      </Text>
                    </View>
                  </View>

                  <StatusBadge status={app.status} />
                </View>

                {/* Screening Stage Indicators */}
                <View className="bg-slate-50 border border-slate-100 rounded-xl p-3 my-2">
                  {isScheduled && (
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Clock color="#d97706" width={14} height={14} />
                        <Text className="text-xs font-bold text-amber-900 ml-1.5">
                          Screening Set: {app.screeningDate} at {app.screeningTime}
                        </Text>
                      </View>
                      <Text className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        LAB READY
                      </Text>
                    </View>
                  )}

                  {isCompleted && (
                    <View>
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center">
                          <Check color="#059669" width={14} height={14} strokeWidth={3} />
                          <Text className="text-xs font-black text-emerald-800 ml-1.5">
                            Screening Passed • {app.unitsCollected || 1} Unit Collected
                          </Text>
                        </View>
                        <Text className="text-[11px] font-black text-amber-600">
                          {'★'.repeat(app.hospitalRating || 5)} ({app.hospitalRating || 5}/5)
                        </Text>
                      </View>
                      <Text className="text-[11px] text-slate-600 leading-4">
                        {app.clinicalNotes || 'Viral tests non-reactive. "Vein of Hope" badge accredited.'}
                      </Text>
                    </View>
                  )}

                  {isDeclined && (
                    <View>
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center">
                          <WarningTriangle color="#dc2626" width={14} height={14} strokeWidth={2.5} />
                          <Text className="text-xs font-black text-rose-800 ml-1.5">
                            Screening Deferred / Ineligible
                          </Text>
                        </View>
                        <Text className="text-[11px] font-black text-slate-500">
                          Rating: {app.hospitalRating || 2}★
                        </Text>
                      </View>
                      <Text className="text-[11px] text-slate-600 leading-4">
                        Reason: {app.clinicalNotes || 'Did not meet clinical safety threshold.'}
                      </Text>
                    </View>
                  )}

                  {isPending && (
                    <Text className="text-xs text-slate-600 font-medium">
                      Awaiting clinical screening appointment date & time.
                    </Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-2 mt-1">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Chat', {
                        screen: 'ChatRoom',
                        params: {
                          otherUserId: donor?.id,
                          otherUserName: donor?.name,
                          role: 'donor',
                        },
                      });
                    }}
                    className="flex-1 bg-slate-100 border border-slate-200 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-xs font-bold text-slate-700">Message</Text>
                  </TouchableOpacity>

                  {isPending && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedApp(app);
                        setIsScheduleModalVisible(true);
                      }}
                      className="flex-1 bg-amber-700 py-2.5 rounded-xl items-center"
                    >
                      <Text className="text-xs font-black text-white">
                        Schedule Date
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isScheduled && (
                    <TouchableOpacity
                      onPress={() => handleOpenEvaluationModal(app)}
                      className="flex-1 bg-emerald-800 py-2.5 rounded-xl items-center shadow-sm"
                    >
                      <Text className="text-xs font-black text-white">
                        Start Lab Screening
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isCompleted && (
                    <View className="flex-1 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl items-center">
                      <Text className="text-xs font-bold text-emerald-800">
                        Award Issued ✓
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Schedule Appointment Drawer Modal */}
      <Modal
        visible={isScheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            {/* Drawer Handle */}
            <TouchableOpacity
              onPress={() => setIsScheduleModalVisible(false)}
              className="items-center py-1 mb-2"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </TouchableOpacity>

            <Text className="text-base font-black text-slate-900 mb-0.5">
              Schedule Clinical Screening
            </Text>
            <Text className="text-xs text-slate-500 mb-4">
              Select intake appointment for {selectedApp?.donor?.name}:
            </Text>

            <View className="mb-3">
              <Text className="text-xs font-bold text-slate-700 mb-1">
                Screening Date (YYYY-MM-DD)
              </Text>
              <TextInput
                value={screeningDate}
                onChangeText={setScreeningDate}
                placeholder="2026-11-12"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1">
                Screening Time (HH:MM)
              </Text>
              <TextInput
                value={screeningTime}
                onChangeText={setScreeningTime}
                placeholder="10:00"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </View>

            <TouchableOpacity
              onPress={handleScheduleScreening}
              className="bg-amber-700 py-3.5 rounded-2xl items-center shadow-md mb-2"
            >
              <Text className="text-white font-black text-xs">
                Confirm Screening Appointment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsScheduleModalVisible(false)}
              className="py-2 items-center"
            >
              <Text className="text-xs font-semibold text-slate-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Multi-Stage Clinical Screening Lab Evaluation Modal */}
      <Modal
        visible={!!labEvalApp}
        transparent
        animationType="slide"
        onRequestClose={() => setLabEvalApp(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-5 max-h-[90%]">
            {/* Drawer Drag Handle */}
            <TouchableOpacity
              onPress={() => setLabEvalApp(null)}
              className="items-center py-1 mb-2"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </TouchableOpacity>

            <Text className="text-lg font-black text-slate-900">
              Clinical Lab Screening & Evaluation
            </Text>
            <Text className="text-xs text-slate-500 mt-0.5 mb-3">
              Donor: <Text className="font-bold text-slate-800">{labEvalApp?.donor?.name}</Text> • Blood Group: <Text className="font-bold text-[#990011]">{labEvalApp?.bloodType}</Text>
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Decision Toggle */}
              <View className="mb-3">
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  Screening Lab Outcome
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setEvalDecision('passed');
                      setHospitalRating(5);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border items-center ${
                      evalDecision === 'passed'
                        ? 'bg-emerald-700 border-emerald-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-black ${
                        evalDecision === 'passed' ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      ✓ Passed & Certified
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setEvalDecision('failed');
                      setHospitalRating(2);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border items-center ${
                      evalDecision === 'failed'
                        ? 'bg-rose-700 border-rose-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-black ${
                        evalDecision === 'failed' ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      ✗ Deferred / Ineligible
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lab Vitals Inputs */}
              <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-3">
                <Text className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Hematology & Viral Testing
                </Text>

                {/* Hemoglobin */}
                <View className="mb-2">
                  <Text className="text-[11px] font-bold text-slate-600 mb-0.5">
                    Hemoglobin Level (g/dL)
                  </Text>
                  <TextInput
                    value={hemoglobin}
                    onChangeText={setHemoglobin}
                    keyboardType="numeric"
                    placeholder="13.8"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                  />
                </View>

                {/* Viral Tests Checklist */}
                <Text className="text-[11px] font-bold text-slate-600 mb-1.5 mt-1">
                  Transmissible Infection Markers:
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  <TouchableOpacity
                    onPress={() => setHivClear(!hivClear)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      hivClear ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                    }`}
                  >
                    <Text className={`text-[11px] font-bold ${hivClear ? 'text-emerald-800' : 'text-rose-800'}`}>
                      HIV: {hivClear ? 'Non-Reactive ✓' : 'Reactive ✗'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setHepBClear(!hepBClear)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      hepBClear ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                    }`}
                  >
                    <Text className={`text-[11px] font-bold ${hepBClear ? 'text-emerald-800' : 'text-rose-800'}`}>
                      Hep B: {hepBClear ? 'Non-Reactive ✓' : 'Reactive ✗'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSyphilisClear(!syphilisClear)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      syphilisClear ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                    }`}
                  >
                    <Text className={`text-[11px] font-bold ${syphilisClear ? 'text-emerald-800' : 'text-rose-800'}`}>
                      Syphilis: {syphilisClear ? 'Non-Reactive ✓' : 'Reactive ✗'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Hospital Rating Selector */}
              <View className="mb-3">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  Assign Donor Quality & Reliability Rating
                </Text>
                <View className="flex-row gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setHospitalRating(star)}
                      className={`flex-1 py-2 rounded-xl items-center border ${
                        hospitalRating >= star
                          ? 'bg-amber-100 border-amber-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Text className="text-sm font-black text-amber-900">
                        ★ {star}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Clinical Notes / Feedback */}
              <View className="mb-4">
                <Text className="text-xs font-bold text-slate-700 mb-1">
                  {evalDecision === 'passed' ? 'Clinical Remarks' : 'Clinical Deferral Reason'}
                </Text>
                <TextInput
                  value={evalDecision === 'passed' ? clinicalFeedback : deferralReason}
                  onChangeText={evalDecision === 'passed' ? setClinicalFeedback : setDeferralReason}
                  multiline
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 min-h-[50px]"
                />
              </View>

              {/* Submit CTA */}
              <TouchableOpacity
                onPress={handleSubmitEvaluation}
                disabled={isSubmittingEval}
                className={`py-3.5 rounded-2xl items-center shadow-md mb-2 ${
                  evalDecision === 'passed' ? 'bg-[#990011]' : 'bg-slate-900'
                }`}
              >
                <Text className="text-white font-black text-xs">
                  {isSubmittingEval
                    ? 'Submitting...'
                    : evalDecision === 'passed'
                    ? 'Confirm Blood Draw & Award Vein of Hope'
                    : 'Submit Deferral (Negative Rating, No Award)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLabEvalApp(null)}
                className="py-2 items-center"
              >
                <Text className="text-xs font-semibold text-slate-500">Close / Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
