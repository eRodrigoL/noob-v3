// app/(app)/boardgame/[id]/_layout.tsx

// Importa ícones para as abas, tema para cores, navegação e hooks do React, além de uma biblioteca para mostrar mensagens rápidas (toasts)
import { Feather, MaterialIcons } from '@expo/vector-icons'; // <-- Ícones aqui
import { useTheme } from '@theme/index';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

// Componente principal que organiza as abas do perfil do jogo

export default function GameProfileTabs() {
  const { colors } = useTheme();// Pega as cores do tema para usar na interface
  const { id } = useLocalSearchParams<{ id?: string }>();// Pega o parâmetro 'id' da URL para saber qual jogo está sendo visualizado
  const router = useRouter();// Hook para controlar navegação (ex: redirecionar)
  const [ready, setReady] = useState(false);// Estado que indica se o componente está pronto para mostrar as abas
  
  // Quando o componente carrega ou o 'id' muda:

  useEffect(() => {
    if (typeof id === 'string') {
      setReady(true); // Marca como pronto se o 'id' for válido
    } else if (id !== undefined) {
      Toast.show({ // Mostra mensagem de erro se o 'id' for inválido
        type: 'error',
        text1: 'Erro ao carregar jogo',
        text2: 'ID inválido. Redirecionando...',
      });
      router.replace('/boardgame'); // Redireciona para a lista de jogos
    }
  }, [id]);

  if (!ready) return null; // Enquanto não estiver pronto, não mostra nada

  // Renderiza as abas do perfil do jogo com ícones e títulos diferentes para cada uma

  return (
    <Tabs
      initialRouteName="index" // Aba inicial que abre
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho padrão
        tabBarActiveTintColor: colors.textOnSemiHighlight, // Cor do texto da aba ativa
        tabBarInactiveTintColor: colors.textOnBase,// Cor do texto das abas inativas
        tabBarStyle: {
          backgroundColor: colors.backgroundSemiHighlight, // Cor de fundo da barra de abas
        },
      }}>

        {/* Aba de informações do jogo */}

      <Tabs.Screen
        name="index"
        options={{
          title: 'Informações',
          tabBarIcon: ({ color, size }) => <Feather name="info" color={color} size={size} />,
        }}
        initialParams={{ id }} // Passa o ID do jogo para a aba
      />

      {/* Aba de análises do jogo */}

      <Tabs.Screen
        name="review"
        options={{
          title: 'Análises',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size} /> // Ícone da aba
          ),
        }}
        initialParams={{ id }}
      />

      {/* Aba do ranking do jogo */}

      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="leaderboard" color={color} size={size} /> // Ícone da aba
          ),
        }}
        initialParams={{ id }}
      />

      {/* Aba para avaliar o jogo */}
      
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
