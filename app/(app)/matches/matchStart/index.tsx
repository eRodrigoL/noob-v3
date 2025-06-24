// app/(app)/matches/MatchStart.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import Toast from 'react-native-toast-message';

const RegistroPartidaScreen = () => {
  const { colors, fontFamily, fontSizes } = useTheme();
  const [explicacao, setExplicacao] = useState(false);
  const [tempoExplicacao, setTempoExplicacao] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputJogo, setInputJogo] = useState('');
  const [inicioPartida, setInicioPartida] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const [validGames, setValidGames] = useState<{ id: string; nome: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchNicknames = async () => {
      try {
        const userId = await storage.getItem('userId');
        const token = await storage.getItem('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const response = await apiClient.get('/usuarios', config);
        const nicknames = response.data.map((usuario: any) => usuario.apelido);
        setValidNicknames(nicknames);
      } catch (error) {
        logger.error('Erro ao buscar apelidos:', error);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await apiClient.get('/jogos');
        const games = response.data.map((jogo: any) => ({
          id: jogo._id,
          nome: jogo.nome,
        }));
        setValidGames(games);
      } catch (error) {
        logger.error('Erro ao buscar jogos:', error);
      }
    };

    fetchNicknames();
    fetchGames();
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
      }
    } else {
      setParticipants([...participants, trimmedInput]);
      setInputText('');
    }
  };

  const validateGame = () => {
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

      // Validando o formato do horário
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

  return (
    <HeaderLayout title="Registro de partida">
      <View style={[globalStyles.containerPadding, { backgroundColor: colors.backgroundBase }]}>
        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Participantes:
        </Text>
        <TextInput
          placeholder="Digite o jogador a adicionar e pressione Enter..."
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
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addParticipant}
        />

        <ScrollView horizontal style={globalStyles.tagContainer}>
          {participants.map((participant, index) => (
            <View
              key={index}
              style={[globalStyles.tag, { backgroundColor: colors.backgroundSemiHighlight }]}>
              <Text
                style={[
                  globalStyles.textJustified,
                  {
                    color: colors.textOnBase,
                    fontFamily,
                    fontSize: fontSizes.base,
                  },
                ]}>
                {participant}
              </Text>
              <TouchableOpacity onPress={() => removeParticipant(index)}>
                <Text
                  style={[
                    globalStyles.textJustified,
                    {
                      color: colors.textOnSemiHighlight,
                      fontFamily,
                      fontSize: fontSizes.small,
                    },
                  ]}>
                  {' ×'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <ButtonSemiHighlight title="Adicionar" onPress={addParticipant} />

        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Jogo:
        </Text>
        <TextInput
          placeholder="Digite o nome do jogo..."
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
          value={inputJogo}
          onChangeText={setInputJogo}
          onBlur={validateGame}
        />

        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Tempo de explicação:
        </Text>

        <TextInput
          placeholder="Minutos"
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
          editable={!explicacao}
          keyboardType="numeric"
        />

        <View style={globalStyles.containerRow}>
          <Switch
            value={explicacao}
            onValueChange={setExplicacao}
            style={[globalStyles.switch]}
            trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
            thumbColor={explicacao ? colors.switchThumbOn : colors.switchThumbOff}
          />
          <Text
            style={[
              globalStyles.textJustified,
              { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
            ]}>
            não houve
          </Text>
        </View>

        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Início da partida:
        </Text>
        <MaskedTextInput
          mask="99:99"
          placeholder="Horário..."
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
