// app/(public)/boardgame/[id]/_layout.tsx
import { useTheme } from '@theme/index';
import { Tabs } from 'expo-router';
import React from 'react';

export default function GameProfileTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="details/index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textOnSemiHighlight,
        tabBarInactiveTintColor: colors.textOnBase,
        tabBarStyle: {
          backgroundColor: colors.backgroundSemiHighlight,
        },
      }}>
      <Tabs.Screen
        name="details/index"
        options={{
          title: 'Informações',
        }}
      />
      <Tabs.Screen
        name="review/index"
        options={{
          title: 'Desempenho',
        }}
      />
      <Tabs.Screen
        name="ranking/index"
        options={{
          title: 'Histórico',
        }}
      />
      <Tabs.Screen
        name="rate/index"
        options={{
          title: 'Histórico',
        }}
      />
    </Tabs>
  );
}
