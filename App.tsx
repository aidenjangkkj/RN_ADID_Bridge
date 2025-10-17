import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  requestTrackingPermissionsAsync,
  getTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

import './global.css';
import WebViewScreen from 'screens/WebViewScreen';
import AdIdScreen from 'screens/AdIdScreen';
import WebBridgeScreen from 'screens/WebBridgeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const askedRef = useRef(false);

  useEffect(() => {
    const askATT = async () => {
      if (askedRef.current || Platform.OS !== 'ios') return;
      askedRef.current = true;
      try {
        const cur = await getTrackingPermissionsAsync();
        if (cur.status === 'undetermined') {
          await requestTrackingPermissionsAsync();
        }
      } catch {}
    };
    askATT();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => {
            const map: Record<string, { on: string; off: string }> = {
              WebView: { on: 'globe', off: 'globe-outline' },
              AdID: { on: 'id-card', off: 'id-card-outline' },
              WebBridge: { on: 'swap-horizontal', off: 'swap-horizontal' },
            };
            const names = map[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };
            return (
              <Ionicons
                name={focused ? (names.on as any) : (names.off as any)}
                size={24}
                color={color}
              />
            );
          },
        })}>
        <Tab.Screen name="WebView" component={WebViewScreen} options={{ title: '웹뷰' }} />
        <Tab.Screen name="AdID" component={AdIdScreen} options={{ title: '광고 ID' }} />
        <Tab.Screen name="WebBridge" component={WebBridgeScreen} options={{ title: '웹 브릿지' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
