// components/SandwichMenu/index.tsx
import ButtonPrimary from '@components/ButtonPrimary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { ROUTES } from '@constants/routes';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import axios from 'axios';
import { Theme } from './Theme';

const { width } = Dimensions.get('window');

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SandwichMenu: React.FC<ModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const [hasOpenMatch, setHasOpenMatch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica autenticação do usuário
  const checkAuthentication = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!userId && !!token);
    } catch (error) {
      logger.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  const checkOpenMatches = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (userId && token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await apiClient.get(
          `/partidas/filtro?registrador=${userId}&fim=null`,
          config
        );
        setHasOpenMatch(response.data.length > 0);
      }
    } catch (error) {
      // TODO: rever o uso do axios neste código
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setHasOpenMatch(false);
        } else {
          logger.error('Erro ao verificar partidas em aberto:', error);
        }
      } else {
        logger.error('Erro desconhecido:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId']);
      Toast.show({
        type: 'success',
        text1: 'Logout realizado com sucesso!',
      });
      setIsAuthenticated(false);
      router.replace(ROUTES.HOME);
    } catch (error) {
      logger.error('Erro ao realizar logout:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      checkAuthentication();
      if (isAuthenticated) checkOpenMatches();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onClose());
    }
  }, [visible, isAuthenticated]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handlePlayPress = () => {
    router.replace(hasOpenMatch ? ROUTES.MATCHES.DETAILS : ROUTES.MATCHES.REGISTER);
  };

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <Animated.View style={styles.modalView}>
              <View style={styles.buttonContainer}>
                <ButtonPrimary title="Início" onPress={() => router.replace(ROUTES.HOME)} />
                {!isAuthenticated ? (
                  <ButtonPrimary title="Login" onPress={() => router.replace(ROUTES.USER.LOGIN)} />
                ) : (
                  <>
                    <ButtonPrimary
                      title="Perfil"
                      onPress={() => router.replace(ROUTES.USER.PROFILE)}
                    />
                    <ButtonPrimary title="Jogar" onPress={handlePlayPress} />
                    <ButtonPrimary title="Sair" onPress={handleLogout} />
                  </>
                )}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// TODO: Mover estilos arquivo próprio
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '60%',
    height: '100%',
    backgroundColor: Theme.light.backgroundButton, // TODO: usar dinamicamente de useTheme
    padding: 20,
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
