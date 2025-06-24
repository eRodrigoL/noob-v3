// app/(app)/boardgame/[id]/_layout.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons'; // <-- Ícones aqui
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

  if (!ready) return null;

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Informações',
          tabBarIcon: ({ color, size }) => <Feather name="info" color={color} size={size} />,
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Análises',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} />
          ),
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="leaderboard" color={color} size={size} />
          ),
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="rate"
        options={{
          title: 'Avaliar',
          tabBarIcon: ({ color, size }) => <Feather name="star" color={color} size={size} />,
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}
