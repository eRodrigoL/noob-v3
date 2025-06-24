// app/(app)/profile/performance/_layout.tsx
import { Feather } from '@expo/vector-icons';
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
          tabBarIcon: ({ color, size }) => <Feather name="info" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Desempenho',
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => <Feather name="clock" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
