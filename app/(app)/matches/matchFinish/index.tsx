// app/(app)/matches/MatchFinish.tsx
import { ButtonHighlight, ButtonSemiHighlight, HeaderLayout } from '@components/index';
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import { storage } from '@store/storage';
import { globalStyles, useTheme } from '@theme/index';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const RegistroPartidaScreen = () => {
  const { colors, fontSizes, fontFamily } = useTheme();
  const [victory, setVictory] = useState('');
  const [scoreType, setScoreType] = useState('');
  const [score, setScore] = useState<string | null>(null);
  const [endTime, setEndTime] = useState('');
  const [partidaId, setPartidaId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const router = useRouter();

  const refreshScreen = () => {
    setVictory('');
    setScoreType('');
    setScore(null);
    setEndTime('');
    setParticipants([]);
    setInputText('');
  };

  useEffect(() => {
    const fetchPartidaEmAberto = async () => {
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

          if (response.data && response.data.length > 0) {
            const partidaAberta = response.data[0];
            setPartidaId(partidaAberta._id);

            const nicknames = partidaAberta.usuarios.map(
              (user: { apelido: string }) => user.apelido
            );
            setValidNicknames(nicknames);
          } else {
            Toast.show({
              type: 'info',
              text1: 'Nenhuma partida em aberto encontrada.',
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Usuário não autenticado.',
          });
        }
      } catch (error) {
        //logger.error("Erro ao buscar partida:", error);
        // Tost.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível buscar a partida.'})
      }
    };

    fetchPartidaEmAberto();
  }, []);

  const addParticipant = () => {
    const trimmedInput = inputText.trim();
    if (
      trimmedInput &&
      validNicknames.includes(trimmedInput) &&
      !participants.includes(trimmedInput)
    ) {
      setParticipants([...participants, trimmedInput]);
      setInputText('');
    } else if (participants.includes(trimmedInput)) {
      Toast.show({
        type: 'info',
        text1: 'Participante já adicionado.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Apelido não encontrado. Por favor, insira um apelido válido.',
      });
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSaveMatch = async () => {
    // Validações de campos obrigatórios

    if (victory != 'naoConcluido') {
      if (!endTime.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'O campo "Fim da partida" é obrigatório.',
        });
        return;
      }

      if (participants.length === 0 && !victory) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Adicione pelo menos um vencedor ou opção de vitória.',
        });
        return;
      }

      if (!scoreType) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Selecione um tipo de pontuação.',
        });
        return;
      }

      if (scoreType === 'pontos' && (!score || isNaN(parseInt(score, 10)))) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Insira uma pontuação válida.',
        });
        return;
      }
    }

    if (!partidaId) return;

    try {
      const token = await storage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
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

      // Validação e formatação do horário 'fim'
      const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const trimmedEndTime = endTime.trim();

      if (
        victory != 'naoConcluido' &&
        (trimmedEndTime.length !== 5 || !horarioRegex.test(trimmedEndTime))
      ) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Formato de horário inválido para o campo "Fim da partida". Use hh:mm.',
        });
        return;
      }

      const [hours, minutes] = trimmedEndTime.split(':').map(Number);
      const now = new Date();
      const fim = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      let vencedor;

      if (victory === 'coletiva') {
        vencedor = validNicknames.map((apelido) => ({ apelido }));
      } else if (victory === 'derrota') {
        vencedor = [{ apelido: 'derrota coletiva' }];
      } else if (victory === 'naoConcluido') {
        await apiClient.delete(`/partidas/${partidaId}`, config);
        Toast.show({
          type: 'success',
          text1: 'A partida cancelada com sucesso.',
        });
        router.push('/boardgame'); // Redireciona para a lista após salvar
        return;
      } else {
        vencedor = participants.map((apelido) => ({ apelido }));
      }

      const partidaData = {
        fim: fim.toISOString(),
        vencedor,
        pontuacao: scoreType === 'pontos' ? parseInt(score || '0', 10) : null,
      };

      await apiClient.put(`/partidas/${partidaId}`, partidaData, config);

      Toast.show({
        type: 'success',
        text1: 'A partida foi atualizada com sucesso.',
      });

      refreshScreen();
      router.push('/boardgame'); // Redireciona para a lista após salvar
    } catch (error) {
      logger.error('Erro ao atualizar a partida:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível atualizar a partida.',
      });
    }
  };

  return (
    <HeaderLayout title="Registro de partida ">
      <View style={[globalStyles.containerPadding, { backgroundColor: colors.backgroundBase }]}>
        <Text
          style={[
            globalStyles.textJustified,
            { color: colors.textOnBase, fontFamily, fontSize: fontSizes.base },
          ]}>
          Fim da partida:
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
          value={endTime}
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

            setEndTime(formattedText.trim());
          }}
          keyboardType="numeric" // Garante que o teclado numérico seja exibido
        />

        <Text
          style={[
            globalStyles.textJustified,
            {
              color: colors.textOnBase,
              fontFamily,
              fontSize: fontSizes.base,
            },
          ]}>
          Vitória:
        </Text>
        <TextInput
          placeholder="Digite o/os vencedores e pressione Enter..."
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
          onSubmitEditing={victory === '' ? addParticipant : undefined}
          editable={victory === ''}
        />

        <View>
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
        </View>

        <ButtonSemiHighlight title="Adicionar" onPress={addParticipant} disabled={victory !== ''} />

        <Text
          style={[
            globalStyles.textJustified,
            {
              color: colors.textOnBase,
              fontFamily,
              fontSize: fontSizes.base,
            },
          ]}>
          Ou selecione as opções abaixo:
        </Text>
        <RadioButton.Group
          onValueChange={(newValue) => {
            setVictory(newValue === victory ? '' : newValue);
            if (newValue !== victory) setParticipants([]);
          }}
          value={victory}>
          <View style={globalStyles.containerRow}>
            <RadioButton
              disabled={participants.length > 0}
              value="coletiva"
              color={colors.backgroundHighlight}
            />
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              Vitória coletiva
            </Text>
          </View>
          <View style={globalStyles.containerRow}>
            <RadioButton
              disabled={participants.length > 0}
              value="derrota"
              color={colors.backgroundHighlight}
            />
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              Derrota coletiva (o jogo venceu)
            </Text>
          </View>
          <View style={globalStyles.containerRow}>
            <RadioButton
              disabled={participants.length > 0}
              value="naoConcluido"
              color={colors.backgroundHighlight}
            />
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              Jogo não concluído
            </Text>
          </View>
        </RadioButton.Group>

        <Text
          style={[
            globalStyles.textJustified,
            {
              color: colors.textOnBase,
              fontFamily,
              fontSize: fontSizes.base,
            },
          ]}>
          Pontuações:
        </Text>
        <RadioButton.Group onValueChange={(newValue) => setScoreType(newValue)} value={scoreType}>
          <View style={globalStyles.containerRow}>
            <RadioButton value="semPontuacao" color={colors.backgroundHighlight} />
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              Sem pontuação
            </Text>
          </View>
          <View style={globalStyles.containerRow}>
            <RadioButton value="pontos" color={colors.backgroundHighlight} />
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              Pontos
            </Text>
          </View>
        </RadioButton.Group>

        {scoreType === 'pontos' && (
          <TextInput
            placeholder="Digite a pontuação"
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
            keyboardType="numeric"
            value={score || ''}
            onChangeText={(text) => setScore(text)}
          />
        )}

        <ButtonHighlight title="Finilizar agora" onPress={handleSaveMatch} />

        <ButtonSemiHighlight
          title="Finalizar depois"
          onPress={() => {
            router.push('/boardgame');
            refreshScreen();
          }}
        />
      </View>
    </HeaderLayout>
  );
};

export default RegistroPartidaScreen;
