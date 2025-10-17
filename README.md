# 📱 RN WebBridge Demo App

**React Native (Expo) + Next.js + WebView Bridge 통신 + 광고 ID + APK 빌드**
 Native ↔ Web 양방향 데이터 교환 및 Android 광고 ID 조회 기능을 포함한 실습 프로젝트

---

## 🚀 개요

이 프로젝트는 **Expo 기반 React Native 앱**과 **Next.js 웹 프로젝트**를 연동하여 다음 기능들을 구현합니다:


* 🌐 **웹뷰 구현**
  
  * RN WebView 사용 하여 웹페이지 렌더링
  
* 📡 **WebView Bridge 통신**

  * RN ↔ Next.js Web 간 메시지 교환
  * 버튼 클릭 시 네이티브에서 데이터 생성 후 WebView로 전송 및 렌더링
  
* 🌐 **Next.js 별도 배포**

  * 브릿지 웹 페이지는 [Vercel](https://count-app-omega.vercel.app/bridge)을 통해 배포
  
* 🧠 **광고 ID 수집 (AAID / IDFA)**
  
  * `expo-tracking-transparency` 모듈을 통해 iOS/Android 광고 ID를 단일 API로 조회
    
* 📦 **EAS 빌드 및 APK 배포**

  * `eas.json` 프로필을 통해 preview(내부배포용 APK) 및 production(AAB) 빌드 지원

---

## 🧱 프로젝트 구조

```
root/
├─ App.tsx                # RN 앱 엔트리, Bottom Tab 구성
├─ screens/
│  ├─ WebViewScreen.tsx   # 일반 웹뷰 테스트
│  ├─ WebBridgeScreen.tsx # 브릿지 연동 테스트
│  └─ AdIdScreen.tsx      # 광고 ID 조회
├─ eas.json               # EAS 빌드 프로필 설정
├─ package.json
└─ README.md
```

---

## 🧠 주요 기능

### 1. 🌐 **Next.js WebBridge 페이지**

`/app/bridge/page.tsx`

* `@webview-bridge/web`을 사용하여 RN WebView와 연결
* `네이티브에 요청하기` 버튼 클릭 → RN에 메시지 전송 → 응답 데이터 렌더링

```tsx
const bridge = linkBridge({
  onReady: () => console.log('[bridge] ready'),
});
```

---

### 2. 📲 **React Native WebBridge 화면**

* `@webview-bridge/react-native` 모듈로 브릿지 생성
* `requestInfo` 함수에서 네트워크 상태 + 랜덤 숫자 생성 → 즉시 네이티브 패널 렌더 → 3초 후 웹에 전송
* `WebView`에서 배포된 Next.js 브릿지 페이지(`https://...vercel.app/bridge`) 로드

```tsx
export const appBridge = bridge({
  async requestInfo() {
    const state = await Network.getNetworkStateAsync();
    const number = Math.floor(Math.random() * 100) + 1;
    return new Promise(resolve =>
      setTimeout(() => resolve({ network: state.type, number }), 3000)
    );
  },
});
```

---

### 3. 🧠 **광고 ID 조회 화면**

`/screens/AdIdScreen.tsx`

* `expo-tracking-transparency`만으로 광고 ID 수집 통일
* iOS: ATT 권한 요청 → IDFA 반환
* Android: AAID 반환, 광고 제한 여부 처리

UI:

* 버튼으로 조회 / 카드 형태 결과 표시 / 가리기 버튼

---

## 🛠️ 빌드 & 배포

(https://expo.dev/accounts/aidenjang/projects/my-expo-app/builds/4d879a92-677f-4bcc-aff6-364716c2b0c2)

---

## 📋 사용한 주요 라이브러리

| 라이브러리                          | 역할                        |
| ------------------------------ | ------------------------- |
| `expo-tracking-transparency`   | 광고 ID 조회 (iOS/Android 통합) |
| `@webview-bridge/web`          | Next.js ↔ RN WebBridge 연결 |
| `@webview-bridge/react-native` | RN 측 브릿지 생성 및 WebView 연결  |
| `expo-network`                 | 네트워크 상태 조회                |
| `expo` / `react-native`        | RN 앱 개발 환경                |
| `next.js`                      | WebBridge UI 및 배포         |

---

## 📄 라이선스

MIT

---
