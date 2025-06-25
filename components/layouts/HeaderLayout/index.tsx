// components/layouts/HeaderLayout/index.tsx
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { useTheme } from '@hooks/useTheme';
import { logger } from '@lib/logger';
import { useFocusEffect } from '@react-navigation/native';
import { storage } from '@store/storage';
import { useMatchStore } from '@store/useMatchStore';
import { useSettingsStore } from '@store/useSettingsStore';
import { useUiStore } from '@store/useUiStore';
import { router } from 'expo-router';
import React, { ReactNode, useState } from 'react';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { hasOpenMatch } = useMatchStore();
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

  // Quando a tela entra em foco, verifica autenticação e reseta o modal
  useFocusEffect(
    React.useCallback(() => {
      checkAuthentication();
      return () => setModalVisible(false);
    }, [])
  );

  const handleSettingsPress = () => {
    router.push(hasOpenMatch ? '/matches/matchFinish' : '/matches/matchStart');
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
