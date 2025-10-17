import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Platform, Pressable } from 'react-native';
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  getAdvertisingId,
} from 'expo-tracking-transparency';

type AdInfo = { id: string | null; isAdTrackingLimited: boolean };

const isZeroIDFA = (id?: string | null) =>
  !id || /^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(id || '');

export default function AdIdScreen() {
  const [info, setInfo] = useState<AdInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [attStatus, setAttStatus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const isIOS = Platform.OS === 'ios';

  const load = async () => {
    setLoading(true);
    try {
      let status: 'granted' | 'denied' | 'undetermined' | undefined = undefined;

      if (isIOS) {
        // 1) ATT 권한 요청 및 상태 조회
        const cur = await getTrackingPermissionsAsync();
        status = cur.status;
        if (status === 'undetermined') {
          const req = await requestTrackingPermissionsAsync();
          status = req.status;
        }
        setAttStatus(status);

        // 권한 거부 시 바로 처리
        if (status !== 'granted') {
          setInfo({ id: null, isAdTrackingLimited: true });
          setVisible(true);
          return;
        }
      }

      // 2) 광고 ID 조회
      const id = await getAdvertisingId();

      // 3) 제한 여부 판단
      const limited = isIOS
        ? status !== 'granted' || isZeroIDFA(id)
        : id == null;

      setInfo({ id, isAdTrackingLimited: limited });
      setVisible(true);
    } catch (e) {
      console.error('광고 ID 조회 실패:', e);
      setInfo({ id: null, isAdTrackingLimited: true });
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-3 text-xl font-bold">
        광고 ID {isIOS ? '(IDFA)' : '(AAID)'}
      </Text>

      {isIOS && (
        <Text className="mb-4 text-neutral-500">
          ATT 권한 상태: <Text className="font-mono">{attStatus ?? '확인 중'}</Text>
        </Text>
      )}

      {!visible && (
        <Pressable onPress={load} className="mb-4 rounded-lg bg-black px-4 py-3">
          <Text className="text-center font-semibold text-white">광고ID 보기</Text>
        </Pressable>
      )}

      {visible && (
        <View className="rounded-lg border border-neutral-300 bg-white p-3">
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text className="font-semibold">ID</Text>
              <Text selectable className="font-mono">
                {info?.id ?? '(없음 / 거부 / 시뮬레이터)'}
              </Text>

              <Text className="mt-3 font-semibold">광고 추적 제한</Text>
              <Text className="font-mono">
                {info?.isAdTrackingLimited ? '활성화됨' : '비활성화'}
              </Text>

              <Pressable
                onPress={() => {
                  setVisible(false);
                  setInfo(null);
                  setAttStatus(null);
                }}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2"
              >
                <Text className="text-center font-semibold">가리기</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );
}
