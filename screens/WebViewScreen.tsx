import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  return (
    <View className="flex-1">
      <WebView
        source={{ uri: 'https://trip-app-v2.vercel.app/' }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        setBuiltInZoomControls={true}
        setDisplayZoomControls={false}
      />
    </View>
  );
}
