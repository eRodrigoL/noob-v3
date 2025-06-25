// components/layouts/HeaderLayout/index.tsx
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { useTheme } from '@hooks/useTheme';
import { logger } from '@lib/logger';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { useSettingsStore } from '@store/useSettingsStore';
import { useUiStore } from '@store/useUiStore';
import axios from 'axios';
import { router } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import { ScrollView, ScrollViewProps, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import stylesHeaderLayout from './styles';

interface HeaderLayoutProps {
  title: string;
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  scrollProps?: ScrollViewProps;
  fontFamilyOverride?: string;
  fontSizeOverride?: number;
  textColorOverride?: string;
  backgroundColorOverride?: string;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  title,
  children,
  scrollable = true,
  contentStyle,
  scrollProps,
  fontFamilyOverride,
  fontSizeOverride,
  textColorOverride,
  backgroundColorOverride,
}) => {
  // const { colors, fontFamily, fontSizes } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [hasOpenMatch, setHasOpenMatch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { colors, fontSizes, fontFamily } = useTheme();

  // Verifica se o usuário está autenticado com base no armazenamento local
  const checkAuthentication = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');
      setIsAuthenticated(!!userId && !!token);
    } catch (error) {
      logger.warn('[Header] Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  // Verifica se o usuário possui partidas em aberto
  const checkOpenMatches = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        logger.warn('[Header] Usuário não autenticado.');
        setHasOpenMatch(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // ← importante para o Render e API REST padrão
        },
      };

      const url = `/partidas/filtro?registrador=${userId}&fim=null`;
      const response = await apiClient.get(url, config);

      if (Array.isArray(response.data)) {
        const encontrou = response.data.length > 0;
        logger.info(`[Header] Partidas abertas encontradas: ${response.data.length}`);
        setHasOpenMatch(encontrou);
      } else {
        logger.warn(
          '[Header] Resposta inesperada da API ao verificar partidas abertas:',
          response.data
        );
        setHasOpenMatch(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          // Supondo que 404 significa "nenhuma partida encontrada"
          logger.info('[Header] Nenhuma partida em aberto.');
          setHasOpenMatch(false);
        } else {
          logger.warn('[Header] Erro de API ao verificar partidas abertas:', error.message);
          setHasOpenMatch(false);
        }
      } else {
        logger.error('[Header] Erro desconhecido ao verificar partidas abertas:', error);
        setHasOpenMatch(false);
      }
    }
  };

  // Quando a tela entra em foco, verifica autenticação e reseta o modal
  useFocusEffect(
    React.useCallback(() => {
      checkAuthentication();
      return () => setModalVisible(false);
    }, [])
  );

  // Se autenticado, verifica se há partidas abertas
  useEffect(() => {
    if (isAuthenticated) {
      checkOpenMatches();
    }
  }, [isAuthenticated]);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleSettingsPress = () => {
    if (hasOpenMatch) {
      // TODO: Adicionar rota para finalizar partida
      router.push('/matches/matchFinish');
    } else {
      // TODO: Adicionar rota para iniciar nova partida
      router.push('/matches/matchStart');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          stylesHeaderLayout.headerContainer,
          { backgroundColor: backgroundColorOverride || colors.backgroundHighlight },
        ]}>
        {/* Botão de menu sanduíche à esquerda */}
        <ButtonHighlight
          title="☰"
          onPress={async () => {
            try {
              await useSettingsStore.getState().loadPreferences();
            } catch (error) {
              logger.error('[HeaderLayout] Erro ao carregar preferências visuais:', error);
            } finally {
              useUiStore.getState().showMenu();
            }
          }}
        />

        {/* Modal de navegação lateral
        <SandwichMenu visible={modalVisible} onClose={handleCloseModal} /> */}

        {/* Título centralizado */}
        <Text
          style={[
            stylesHeaderLayout.title,
            {
              fontFamily: fontFamilyOverride || fontFamily,
              fontSize: fontSizeOverride || fontSizes.giant,
              color: textColorOverride || colors.textOnHighlight,
            },
          ]}>
          {title}
        </Text>

        {/* Botão 🎲 à direita (visível apenas se logado) */}
        <View style={stylesHeaderLayout.iconPlaceholder}>
          {isAuthenticated && (
            <ButtonHighlight
              title="🎲"
              onPress={handleSettingsPress}
              fontFamilyOverride={fontFamilyOverride}
              fontSizeOverride={fontSizeOverride}
              colorOverride={textColorOverride}
              backgroundColorOverride={backgroundColorOverride}
            />
          )}
        </View>
      </View>

      {/* Conteúdo da tela, com scroll opcional */}
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[
            stylesHeaderLayout.childrenPadding,
            { flexGrow: 1 },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollProps}>
          {children}
        </ScrollView>
      ) : (
        <View style={[stylesHeaderLayout.childrenPadding, { flex: 1 }, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export default HeaderLayout;

/* EXEMPLOS DE IMPORTAÇÃO

Scroll HABILITADO: <HeaderLayout title="Tela de Teste">
  [conteúdo]
</HeaderLayout>

Scroll DESABILITADO: <HeaderLayout title="Tela de Teste" scrollable={false}>
  [conteúdo]
</HeaderLayout>

*/
