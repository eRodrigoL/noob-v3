// app/(legacy)/matches/MatchFinish.tsx
import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '@services/apiClient';
import styles from '@theme/themOld/globalStyle';
import { Theme } from '@theme/themOld/theme';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const RegistroPartidaScreen = () => {
  const [victory, setVictory] = useState('');
  const [scoreType, setScoreType] = useState('');
  const [score, setScore] = useState<string | null>(null);
  const [endTime, setEndTime] = useState('');
  const [partidaId, setPartidaId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [validNicknames, setValidNicknames] = useState<string[]>([]);
  const navigation = useNavigation();

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
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

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
      const token = await AsyncStorage.getItem('token');
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
        router.push('/(legacy)/boardgameOld'); // Redireciona para a lista após salvar
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
      router.push('/(legacy)/boardgameOld'); // Redireciona para a lista após salvar
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, localStyles.header]}>Registro de partida</Text>

        <Text style={styles.label}>Fim da partida:</Text>
        <MaskedTextInput
          mask="99:99"
          placeholder="18:30"
          style={[styles.input, localStyles.input]}
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

        <Text style={styles.label}>Vitória:</Text>
        <TextInput
          placeholder="Digite o/os vencedores e pressione Enter..."
          style={[styles.input, localStyles.input]}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={victory === '' ? addParticipant : undefined}
          editable={victory === ''}
        />
        <TouchableOpacity
          style={localStyles.addButton}
          onPress={victory === '' ? addParticipant : undefined}
          disabled={victory !== ''}>
          <Text style={localStyles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>

        <ScrollView horizontal style={localStyles.tagContainer}>
          {participants.map((participant, index) => (
            <View key={index} style={localStyles.tag}>
              <Text style={localStyles.tagText}>{participant}</Text>
              <TouchableOpacity onPress={() => removeParticipant(index)}>
                <Text style={localStyles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.label}>Ou selecione as opções abaixo:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => {
            setVictory(newValue === victory ? '' : newValue);
            if (newValue !== victory) setParticipants([]);
          }}
          value={victory}>
          <View style={localStyles.radioContainer}>
            <RadioButton disabled={participants.length > 0} value="coletiva" />
            <Text style={localStyles.radioLabel}>Vitória coletiva</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton disabled={participants.length > 0} value="derrota" />
            <Text style={localStyles.radioLabel}>Derrota coletiva (o jogo venceu)</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton disabled={participants.length > 0} value="naoConcluido" />
            <Text style={localStyles.radioLabel}>Jogo não concluído</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.label}>Pontuações:</Text>
        <RadioButton.Group onValueChange={(newValue) => setScoreType(newValue)} value={scoreType}>
          <View style={localStyles.radioContainer}>
            <RadioButton value="semPontuacao" />
            <Text style={localStyles.radioLabel}>Sem pontuação</Text>
          </View>
          <View style={localStyles.radioContainer}>
            <RadioButton value="pontos" />
            <Text style={localStyles.radioLabel}>Pontos</Text>
          </View>
        </RadioButton.Group>

        {scoreType === 'pontos' && (
          <TextInput
            placeholder="Digite a pontuação"
            style={[styles.input, localStyles.input]}
            keyboardType="numeric"
            value={score || ''}
            onChangeText={(text) => setScore(text)}
          />
        )}

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSaveMatch}>
          <Text style={styles.buttonPrimaryText}>Salvar Partida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
            router.push('/(legacy)/boardgameOld'); // Redireciona para a lista ao finalizar depois
            refreshScreen();
          }}>
          <Text style={styles.buttonPrimaryText}>Finalizar depois</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  header: {
    color: Theme.light.backgroundButton,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Theme.light.backgroundCard,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioLabel: {
    color: Theme.light.text,
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: Theme.light.secondary.background,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: Theme.light.textButton,
  },
  tagContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: Theme.light.secondary.backgroundButton,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  tagText: {
    color: Theme.light.textButton,
    marginRight: 5,
  },
  removeButtonText: {
    color: Theme.light.textButton,
    fontWeight: 'bold',
  },
});

export default RegistroPartidaScreen;
