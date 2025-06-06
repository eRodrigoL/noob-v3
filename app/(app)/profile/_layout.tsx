// app/(app)/profile/performance/_layout.tsx
import { useTheme } from '@theme/index';
import { Tabs } from 'expo-router';
import React from 'react';

export default function UserProfileTabs() {
  const { colors } = useTheme();

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
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Desempenho',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
        }}
      />
    </Tabs>
  );
}
