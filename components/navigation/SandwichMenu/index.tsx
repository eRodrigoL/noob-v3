// components/buttons/SandwichMenu/index.tsx
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { useTheme } from '@hooks/useTheme';
import { logger } from '@lib/logger';
import { storage } from '@store/storage';
import { useMatchStore } from '@store/useMatchStore';
import Constants from 'expo-constants';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Modal, Platform, Pressable, View } from 'react-native';
import stylesSandwichMenu from './styles';

const isDev = Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_MODE === 'development';
const { width } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const SandwichMenu: React.FC<ModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const hasOpenMatch = useMatchStore((state) => state.hasOpenMatch);

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

  // Botão que registra partidas
  const handlePlayPress = () => {
    handleClose();
    if (hasOpenMatch) {
      router.push('/matches/matchFinish');
    } else {
      router.push('/matches/matchStart');
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

                <ButtonHighlight title="Registrar partida" onPress={handlePlayPress} />

                <ButtonHighlight
                  title="Adicionar jogo"
                  onPress={() => router.push('/boardgame/registerGame')}
                />

                <ButtonHighlight title="Feedback" onPress={() => handleNavigate('/feedback')} />

                {isDev && (
                  <ButtonHighlight
                    title="testando telas"
                    onPress={() => handleNavigate('/boardgame')}
                  />
                )}

                <ButtonHighlight title="Sair" onPress={handleLogout} />
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default SandwichMenu;
