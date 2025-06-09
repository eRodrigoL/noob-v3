// app/_layout.tsx
import SandwichMenu from '@components/buttons/SandwichMenu';
import { useUiStore } from '@store/useUiStore';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useKeepApiAwake } from '@hooks/useKeepApiAwke';
import { useSettingsStore } from '@store/useSettingsStore';
import { storage } from '@store/storage';

SplashScreen.preventAutoHideAsync(); // impede que o splash desapareça automaticamente

export default function RootLayout() {
  const { isLoaded, loadPreferences } = useSettingsStore();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const { isMenuVisible, hideMenu } = useUiStore();

  useKeepApiAwake();

  useEffect(() => {
    const prepare = async () => {
      const userId = await storage.getItem('userId');
      if (userId) {
        await loadPreferences(); // TODO: @motathais eu removi "userId" porque apresentava "0 argumentos eram esperados, mas 1 foram obtidos.ts(2554)" em "userId"
      } else {
        useSettingsStore.setState({ isLoaded: true }); // fallback caso não haja userId
      }
      await SplashScreen.hideAsync(); // esconde o splash após carregar preferências
    };

    if (!isLoaded) prepare();

    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, [isLoaded]);

  if (!isLoaded) return null; // enquanto não carrega, mantém tela branca (splash visível)

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#ffffffff" />
      <Stack screenOptions={{ headerShown: false }} />
      <SandwichMenu visible={isMenuVisible} onClose={hideMenu} />
      <Toast />
    </SafeAreaProvider>
  );
}
