// app/(app)/boardgame/[id]/_layout.tsx
import { useTheme } from '@theme/index';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function GameProfileTabs() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      setReady(true);
    } else if (id !== undefined) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar jogo',
        text2: 'ID inválido. Redirecionando...',
      });
      router.replace('/boardgame');
    }
  }, [id]);

  if (!ready) return null; // não renderiza Tabs até garantir o id

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textOnSemiHighlight,
        tabBarInactiveTintColor: colors.textOnBase,
        tabBarStyle: {
          backgroundColor: colors.backgroundSemiHighlight,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Informações' }} />
      <Tabs.Screen name="review" options={{ title: 'Análises' }} />
      <Tabs.Screen name="ranking" options={{ title: 'Ranking' }} />
      <Tabs.Screen name="rate" options={{ title: 'Avaliar' }} />
    </Tabs>
  );
}
