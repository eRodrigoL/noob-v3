// app/(app)/matches/MatchStart.tsx
import { ButtonHighlight, GameInput, HeaderLayout, ParticipantInput } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { useMatchStore } from '@store/useMatchStore';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import Toast from 'react-native-toast-message';

const RegistroPartidaScreen = () => {
  const { colors, fontFamily, fontSizes } = useTheme();
  const [explicacao, setExplicacao] = useState(true);
  const [tempoExplicacao, setTempoExplicacao] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputJogo, setInputJogo] = useState('');
  const [inicioPartida, setInicioPartida] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const [validGames, setValidGames] = useState<{ id: string; nome: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await storage.getItem('userId');
        const token = await storage.getItem('token');

        if (!userId || !token) {
          Toast.show({
            type: 'error',
            text1: 'Erro de autenticação',
            text2: 'Usuário não autenticado.',
          });
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const [usuariosRes, jogosRes] = await Promise.all([
          apiClient.get('/usuarios', config),
          apiClient.get('/jogos'),
        ]);

        if (Array.isArray(usuariosRes.data)) {
          const nicknames = usuariosRes.data.map((usuario: any) => usuario.apelido);
          setValidNicknames(nicknames);
        } else {
          logger.warn('Resposta inesperada de /usuarios:', usuariosRes.data);
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Falha ao carregar usuários.',
          });
        }

        if (Array.isArray(jogosRes.data)) {
          const games = jogosRes.data.map((jogo: any) => ({
            id: jogo._id,
            nome: jogo.nome,
          }));
          setValidGames(games);
        } else {
          logger.warn('Resposta inesperada de /jogos:', jogosRes.data);
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Falha ao carregar jogos.',
          });
        }
      } catch (error) {
        logger.error('Erro ao carregar dados iniciais:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Não foi possível carregar os dados. Tente novamente.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addParticipant = () => {
    const trimmedInput = inputText.trim();

    if (!trimmedInput) return;

    if (trimmedInput.startsWith('@')) {
      if (validNicknames.includes(trimmedInput)) {
        setParticipants([...participants, trimmedInput]);
        setInputText('');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Apelido não encontrado. Por favor, insira um apelido válido.',
        });
        setInputText('');
      }
    } else {
      setParticipants([...participants, trimmedInput]);
      setInputText('');
    }
  };

  const validateGame = () => {
    if (validGames.length === 0) return;

    const selectedGame = validGames.find((game) => game.nome === inputJogo.trim());
    if (!selectedGame) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Jogo não encontrado. Por favor, insira um jogo válido.',
      });
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const registrarPartida = async () => {
    if (participants.length === 0 || !inputJogo || !inicioPartida) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const selectedGame = validGames.find((game) => game.nome === inputJogo.trim());
    if (!selectedGame) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Jogo não encontrado. Por favor, insira um jogo válido.',
      });
      return;
    }

    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const trimmedInicioPartida = inicioPartida.trim();

      if (trimmedInicioPartida.length !== 5 || !horarioRegex.test(trimmedInicioPartida)) {
        throw new Error('Horário inválido. Insira no formato hh:mm.');
      }

      const [hours, minutes] = trimmedInicioPartida.split(':').map(Number);
      const now = new Date();
      const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      const usuarios = participants.map((apelido) => ({ apelido }));

      const partidaData = {
        usuarios,
        jogo: selectedGame.id,
        explicacao: tempoExplicacao,
        inicio: inicio.toISOString(),
        registrador: userId,
      };

      const response = await apiClient.post('/partidas', partidaData, config);

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Partida registrada!',
          text2: 'Seus dados foram salvos com sucesso.',
        });

        await useMatchStore.getState().checkOpenMatch();

        setParticipants([]);
        setInputJogo('');
        setTempoExplicacao('');
        setInicioPartida('');
        setExplicacao(false);

        router.push('/(app)/matches/matchFinish');
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Erro ao registrar a partida:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Ocorreu um erro ao registrar a partida.',
        });
      } else {
        logger.error('Erro desconhecido:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Ocorreu um erro inesperado.',
        });
      }
    }
  };

  useEffect(() => {
    if (explicacao) {
      setTempoExplicacao('');
    }
  }, [explicacao]);

  if (isLoading) {
    return (
      <HeaderLayout title="Registro de partida">
        <View style={[globalStyles.containerPadding, { backgroundColor: colors.backgroundBase }]}>
          <Text
            style={[
              globalStyles.textJustified,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Carregando dados...
          </Text>
        </View>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout title="Registro de partida">
      <View style={[globalStyles.containerPadding, { backgroundColor: colors.backgroundBase }]}>
        <ParticipantInput
          value={inputText}
          onChangeText={setInputText}
          onAdd={addParticipant}
          validNicknames={validNicknames}
          participants={participants}
          onRemove={removeParticipant}
        />

        <GameInput
          value={inputJogo}
          onChangeText={setInputJogo}
          onSelect={(selected) => setInputJogo(selected)}
          validGames={validGames.map((j) => j.nome)}
        />

        <View style={globalStyles.containerRow}>
          <Text
            style={[
              globalStyles.textJustified,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            Tempo de explicação:
          </Text>
          <View style={{ paddingLeft: 15 }}>
            <Switch
              value={explicacao}
              onValueChange={setExplicacao}
              style={[globalStyles.switch]}
              trackColor={{
                false: colors.switchTrackOff,
                true: colors.switchTrackOn,
              }}
              thumbColor={explicacao ? colors.switchThumbOn : colors.switchThumbOff}
            />
          </View>
          <Text
            style={[
              globalStyles.textJustified,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            não houve explicação
          </Text>
        </View>

        {!explicacao && (
          <TextInput
            placeholder="...em MINUTOS"
            placeholderTextColor={colors.textOnBase}
            style={[
              globalStyles.input,
              {
                color: colors.textOnBase,
                fontFamily,
                fontSize: fontSizes.base,
                borderWidth: 1,
                borderColor: colors.textOnBase,
              },
            ]}
            value={tempoExplicacao}
            onChangeText={setTempoExplicacao}
            keyboardType="numeric"
          />
        )}

        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Horário do início da partida (exp.: 20:30):
        </Text>
        <MaskedTextInput
          mask="99:99"
          placeholder="Digite somente números..."
          placeholderTextColor={colors.textOnBase}
          style={[
            globalStyles.input,
            {
              color: colors.textOnBase,
              fontFamily,
              fontSize: fontSizes.base,
              borderWidth: 1,
              borderColor: colors.textOnBase,
            },
          ]}
          value={inicioPartida}
          onChangeText={(text, rawText) => {
            const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            const formattedText = rawText.replace(/^(\d{2})(\d{2})$/, '$1:$2');

            if (formattedText.length === 5 && !horarioRegex.test(formattedText)) {
              Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Formato de horário inválido. Use hh:mm.',
              });
            }

            setInicioPartida(formattedText.trim());
          }}
          keyboardType="numeric"
        />

        <ButtonHighlight title="Avançar" onPress={registrarPartida} />
      </View>
    </HeaderLayout>
  );
};

export default RegistroPartidaScreen;
