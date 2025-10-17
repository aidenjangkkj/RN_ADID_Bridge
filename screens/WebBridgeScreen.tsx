import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import * as Network from 'expo-network';
import { createWebView, bridge } from '@webview-bridge/react-native';

type BridgeResponse = { network: string; number: number };
let publishNativeSnap: ((snap: BridgeResponse) => void) | null = null;

// 브릿지 구현
export const appBridge = bridge({
  async requestInfo(): Promise<BridgeResponse> {
    const state = await Network.getNetworkStateAsync();
    const network =
      state.isConnected && state.isInternetReachable
        ? state.type === Network.NetworkStateType.WIFI
          ? 'Wi-Fi'
          : state.type === Network.NetworkStateType.CELLULAR
            ? '셀룰러 (LTE/5G)'
            : String(state.type)
        : '오프라인';

    const number = Math.floor(Math.random() * 100) + 1;
    const snap = { network, number };

    try {
      publishNativeSnap?.(snap);
    } catch (e) {}

    return new Promise<BridgeResponse>((resolve) => {
      setTimeout(() => resolve(snap), 1500);
    });
  },
});

// WebView 컴포넌트 생성
export const { WebView } = createWebView({ bridge: appBridge, debug: true });

export default function WebBridgeScreen() {
  const webRef = useRef<React.ComponentRef<typeof WebView>>(null);
  const [nativeSnap, setNativeSnap] = useState<BridgeResponse | null>(null);

  // 네이티브 상태 업데이트 함수
  useEffect(() => {
    publishNativeSnap = setNativeSnap;

    // 언마운트 시 정리
    return () => {
      if (publishNativeSnap === setNativeSnap) publishNativeSnap = null;
    };
  }, []);

  const uri = useMemo(() => 'https://count-app-omega.vercel.app/bridge', []);

  return (
    <View className="flex-1 bg-neutral-50 p-4">
      <View className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <Text className="mb-2 text-base font-semibold">네이티브 패널</Text>
        <View className="rounded-xl border border-neutral-200 p-3">
          <View className="flex-row justify-between">
            <Text className="text-neutral-600">네트워크</Text>
            <Text className="font-semibold">{nativeSnap?.network ?? '-'}</Text>
          </View>
          <View className="mt-1 flex-row justify-between">
            <Text className="text-neutral-600">랜덤 숫자</Text>
            <Text className="font-semibold">{nativeSnap?.number ?? '-'}</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <WebView
          ref={webRef}
          source={{ uri }}
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(req) => req.url.startsWith('https://count-app-omega.vercel.app/')}
        />
      </View>
    </View>
  );
}
