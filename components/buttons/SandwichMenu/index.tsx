// components/buttons/SandwichMenu/index.tsx
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { useTheme } from '@hooks/useTheme';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Modal, Platform, Pressable, View } from 'react-native';
import stylesSandwichMenu from './styles';

const isDev = Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_MODE === 'development';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const SandwichMenu: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const [hasOpenMatch, setHasOpenMatch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Verifica se há usuário logado
  const checkAuthentication = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');
      setIsAuthenticated(!!userId && !!token);
    } catch (error) {
      logger.warn('[SandwichMenu] Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  // Verifica se há partidas em aberto
  const checkOpenMatches = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (userId && token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        };

        const response = await apiClient.get(
          `/partidas/filtro?registrador=${userId}&fim=null`,
          config
        );

        setHasOpenMatch(response.data.length > 0);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setHasOpenMatch(false);
        } else {
          logger.warn('[SandwichMenu] Erro na verificação de partidas:', error.message);
        }
      } else {
        logger.warn('[SandwichMenu] Erro desconhecido:', error);
      }
    }
  };

  // Logout do usuário
  const handleLogout = async () => {
    try {
      await Promise.all([storage.removeItem('token'), storage.removeItem('userId')]);

      if (Platform.OS === 'web') {
        logger.log('[SandwichMenu] Logout realizado com sucesso.');
      } else {
        Alert.alert('Sucesso', 'Logout realizado com sucesso!');
      }

      setIsAuthenticated(false);
      onClose();
      router.push('/login');
    } catch (error) {
      logger.warn('[SandwichMenu] Erro ao realizar logout:', error);
    }
  };

  // Animação de entrada e saída do menu
  useEffect(() => {
    if (visible) {
      checkAuthentication();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => onClose());
    }
  }, [visible]);

  // Verifica partidas após confirmação de login
  useEffect(() => {
    if (isAuthenticated) {
      checkOpenMatches();
    }
  }, [isAuthenticated]);

  // Fecha o menu com animação
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => onClose());
  };

  // Navega para uma rota e fecha o menu
  const handleNavigate = (path: Href) => {
    handleClose();
    router.push(path);
  };

  // Lógica para botão "Jogar"
  const handlePlayPress = () => {
    handleClose();
    if (hasOpenMatch) {
      // TODO: Adicionar rota para finalizar partida
      router.push('/matches/MatchFinish');
    } else {
      // TODO: Adicionar rota para finalizar partida
      router.push('/matches/MatchStart');
    }
  };

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={handleClose}>
      <Pressable onPress={handleClose} style={stylesSandwichMenu.modalContainer}>
        <Animated.View
          style={[
            stylesSandwichMenu.modalView,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: colors.backgroundSemiHighlight,
            },
          ]}>
          <View style={stylesSandwichMenu.buttonContainer}>
            <ButtonHighlight title="Início" onPress={() => handleNavigate('/boardgame')} />
            {!isAuthenticated ? (
              <ButtonHighlight title="Login" onPress={() => handleNavigate('/login')} />
            ) : (
              <>
                <ButtonHighlight title="Perfil" onPress={() => handleNavigate('/profile')} />

                <ButtonHighlight
                  title="Configurações"
                  onPress={() => handleNavigate('/settings')}
                />

                <ButtonHighlight title="Jogar" onPress={handlePlayPress} />

                <ButtonHighlight title="Feedback" onPress={() => handleNavigate('/feedback')} />

                {isDev && (
                  <ButtonHighlight
                    title="testando telas"
                    onPress={() => handleNavigate('/boardgame')}
                  />
                )}
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default SandwichMenu;
