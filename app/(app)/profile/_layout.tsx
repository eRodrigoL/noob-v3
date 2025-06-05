// app/(app)/profile/performance/index.tsx
import { useTheme } from '@theme/index';
import { Tabs } from 'expo-router';
import React from 'react';

export default function ProfileLayoutTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="overview/index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textOnSemiHighlight,
        tabBarInactiveTintColor: colors.textOnBase,
        tabBarStyle: {
          backgroundColor: colors.backgroundSemiHighlight,
        },
      }}>
      <Tabs.Screen
        name="overview/index"
        options={{
          title: 'Informações',
        }}
      />
      <Tabs.Screen
        name="performance/index"
        options={{
          title: 'Desempenho',
        }}
      />
      <Tabs.Screen
        name="history/index"
        options={{
          title: 'Histórico',
        }}
      />
    </Tabs>
  );
}
