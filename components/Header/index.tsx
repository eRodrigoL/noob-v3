// components/Header/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { Theme } from '@theme/themOld/theme';
import axios from 'axios';
import SandwichMenu from '../buttons/SandwichMenu';
import { storage } from '@store/storage';

const Header = ({ title }: { title: string }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasOpenMatch, setHasOpenMatch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para verificar se o usuário está autenticado
  const checkAuthentication = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');
      setIsAuthenticated(!!userId && !!token);
    } catch (error) {
      logger.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  // Função para verificar se há partidas em aberto
  const checkOpenMatches = async () => {
    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

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
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          setHasOpenMatch(false); // Nenhuma partida em aberto
        } else {
          logger.error('Erro ao verificar partidas em aberto:', error);
        }
      } else {
        logger.error('Erro desconhecido:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkAuthentication();
      if (isAuthenticated) checkOpenMatches();
      return () => setModalVisible(false);
    }, [isAuthenticated])
  );

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  // Função para decidir qual tela abrir ao clicar no botão de configurações
  const handleSettingsPress = () => {
    //.replace(hasOpenMatch ? '/(app)/matches/matchFinish' : '/(app)/matches/matchStart'); // TODO: remover 
    router.push(hasOpenMatch ? '/(app)/matches/matchFinish' : '/(app)/matches/matchStart');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.menuButton} onPress={handleOpenModal}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      <SandwichMenu visible={modalVisible} onClose={handleCloseModal} />

      <Text style={styles.title}>{title}</Text>

      <View style={styles.iconPlaceholder}>
        {isAuthenticated && (
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
            <Text style={styles.text}>🎲</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// TODO: Mover estilos arquivo próprio
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    backgroundColor: Theme.light.backgroundHeader, // TODO: substituir por uso de useTheme()
    height: 60,
    zIndex: 1,
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.light.text, // TODO: substituir por uso de useTheme()
    textAlign: 'center',
    flex: 1,
  },
  text: {
    fontSize: 30,
  },
  settingsButton: {
    padding: 10,
  },
  iconPlaceholder: {
    width: 55,
    alignItems: 'center',
  },
});

export default Header;
