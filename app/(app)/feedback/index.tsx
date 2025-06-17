// app/(app)/feedback/index.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';

const FeedbackScreen: React.FC = () => {
  const { colors, fontFamily, fontSizes } = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!assunto || !descricao) {
      Toast.show({ type: 'error', text1: 'Preencha todos os campos.' });
      return;
    }

    try {
      setLoading(true);
      const token = await storage.getItem('token');
      const userId = await storage.getItem('userId');

      if (!token || !userId) {
        Toast.show({ type: 'error', text1: 'Usuário não autenticado.' });
        return;
      }

      const payload = { idUsuario: userId, assunto, descricao };

      await apiClient.post('/feedbacks', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Toast.show({ type: 'success', text1: 'Feedback enviado com sucesso!' });
      router.back();
    } catch (error) {
      logger.error('Erro ao enviar feedback:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar feedback',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeaderLayout title="Enviar Feedback">
      <View
        style={[
          globalStyles.containerPadding,
          {
            backgroundColor: colors.backgroundBase,
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: width > 600 ? '15%' : 16,
          },
        ]}>
        <Text
          style={[
            globalStyles.textJustifiedBoldItalic,
            { fontSize: fontSizes.base, fontFamily, color: colors.textOnBase },
          ]}>
          Assunto:
        </Text>
        <TextInput
          style={[
            globalStyles.input,
            { fontSize: fontSizes.base, fontFamily, color: colors.textOnBase },
          ]}
          placeholder="Assunto"
          value={assunto}
          onChangeText={setAssunto}
        />

        <Text
          style={[
            globalStyles.textJustifiedBoldItalic,
            {
              fontSize: fontSizes.base,
              fontFamily,
              color: colors.textOnBase,
              marginTop: 16,
            },
          ]}>
          Descrição:
        </Text>
        <TextInput
          multiline
          style={[
            globalStyles.input,
            {
              fontSize: fontSizes.base,
              fontFamily,
              color: colors.textOnBase,
              height: Math.max(100, height * 0.1),
              textAlignVertical: 'top',
            },
          ]}
          placeholder="Descreva sua experiência, sugestão ou problema."
          value={descricao}
          onChangeText={setDescricao}
        />

        <View style={{ marginTop: 24 }}>
          <ButtonHighlight
            title={loading ? 'Enviando...' : 'Enviar Feedback'}
            onPress={handleSubmit}
            disabled={loading}
          />
          <ButtonSemiHighlight title="Cancelar" onPress={() => router.back()} />
        </View>
      </View>
    </HeaderLayout>
  );
};

export default FeedbackScreen;
