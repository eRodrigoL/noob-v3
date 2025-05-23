// app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import Toast from 'react-native-toast-message';

import { useKeepApiAwake } from '@hooks/useKeepApiAwke';
import { useSettingsStore } from '@store/useSettingsStore';

SplashScreen.preventAutoHideAsync(); // impede que o splash desapareça automaticamente

export default function RootLayout() {
  const { isLoaded, loadPreferences } = useSettingsStore();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useKeepApiAwake();

  useEffect(() => {
    const prepare = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        await loadPreferences(userId);
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
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}
