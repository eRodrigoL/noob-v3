// components/inputs/ParticipantInput/index.tsx
import { ButtonSemiHighlight } from '@components/index';
import { globalStyles, useTheme } from '@theme/index';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  onAdd: (nickname: string) => void;
  validNicknames: string[];
  participants: string[];
  onRemove: (index: number) => void;
}

const ParticipantInput: React.FC<Props> = ({
  value,
  onChangeText,
  onAdd,
  validNicknames,
  participants,
  onRemove,
}) => {
  const { colors, fontSizes, fontFamily } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sanitizeInput = (raw: string) => {
    let cleaned = raw.replace(/[^a-zA-Z0-9@]/g, '');
    const atCount = (cleaned.match(/@/g) || []).length;
    cleaned = cleaned.replace(/@/g, '');
    if (raw.startsWith('@')) cleaned = '@' + cleaned;
    return cleaned;
  };

  const handleInput = (text: string) => {
    const sanitized = sanitizeInput(text);
    onChangeText(sanitized);

    if (sanitized.startsWith('@')) {
      const query = sanitized.slice(1).toLowerCase();
      const filtered = validNicknames
        .filter((nick) => nick.toLowerCase().includes(query))
        .slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const isDuplicate = participants.some((p) => p.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Esse participante já foi adicionado.',
      });
      onChangeText('');
      return;
    }

    if (trimmed.startsWith('@')) {
      if (validNicknames.includes(trimmed)) {
        onAdd(trimmed);
      } else {
        Toast.show({ type: 'error', text1: 'Erro', text2: 'Apelido não encontrado.' });
        onChangeText('');
        return;
      }
    } else {
      onAdd(trimmed);
    }

    onChangeText('');
    setSuggestions([]);
  };

  const handleBlur = (_e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (value.trim().length > 0) {
      onChangeText('');
    }
    setSuggestions([]);
  };

  return (
    <View>
      <TextInput
        ref={inputRef}
        placeholder="Digite o jogador e pressione Enter..."
        value={value}
        onChangeText={handleInput}
        onSubmitEditing={handleSubmit}
        onBlur={handleBlur}
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
      />

      {value.startsWith('@') && suggestions.length > 0 && (
        <View
          style={{
            backgroundColor: colors.backgroundSemiHighlight,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 4,
            marginTop: 4,
            paddingVertical: 4,
          }}>
          {suggestions.slice(0, 6).map((item, index) => (
            <View key={index}>
              <Text
                style={{
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.small,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}

      <FlatList
        horizontal
        data={participants}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[globalStyles.tag, { backgroundColor: colors.backgroundSemiHighlight }]}>
            <Text
              style={[
                globalStyles.textJustified,
                {
                  color: colors.textOnBase,
                  fontFamily,
                  fontSize: fontSizes.base,
                },
              ]}>
              {item}
            </Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
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
        )}
        showsHorizontalScrollIndicator={false}
        style={globalStyles.tagContainer}
      />

      <ButtonSemiHighlight title="Adicionar" onPress={handleSubmit} />
    </View>
  );
};

export default ParticipantInput;
