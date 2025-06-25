// components/inputs/VictoryInput/index.tsx
import { globalStyles, useTheme } from '@theme/index';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  winners: string[];
  setWinners: React.Dispatch<React.SetStateAction<string[]>>;
  participants: string[];
}

const VictoryInput: React.FC<Props> = ({ winners, setWinners, participants }) => {
  const { colors, fontSizes, fontFamily } = useTheme();

  const handleToggle = (apelido: string) => {
    if (winners.includes(apelido)) {
      setWinners(winners.filter((a) => a !== apelido));
    } else {
      setWinners([...winners, apelido]);
    }
  };

  const renderItem = (apelido: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[globalStyles.tag, { backgroundColor: colors.backgroundSemiHighlight }]}>
        <Text
          style={{
            color: colors.textOnBase,
            fontFamily,
            fontSize: fontSizes.base,
          }}>
          {apelido}
        </Text>
        <Text
          style={{
            color: colors.textOnSemiHighlight,
            fontFamily,
            fontSize: fontSizes.small,
            paddingLeft: 6,
          }}>
          ⇄
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginVertical: 8 }}>
      <Text
        style={{
          color: colors.textOnBase,
          fontFamily,
          fontSize: fontSizes.base,
          marginBottom: 4,
        }}>
        Jogadores da partida:
      </Text>
      <FlatList
        horizontal
        data={participants.filter((p) => !winners.includes(p))}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderItem(item, () => handleToggle(item))}
        style={[
          globalStyles.tagContainer,
          {
            backgroundColor: colors.backgroundBase,
            borderColor: colors.textOnBase,
            borderWidth: 1,
          },
        ]}
        showsHorizontalScrollIndicator={false}
      />

      <Text
        style={{
          color: colors.textOnBase,
          fontFamily,
          fontSize: fontSizes.base,
          marginTop: 10,
          marginBottom: 4,
        }}>
        Vencedores:
      </Text>
      <FlatList
        horizontal
        data={winners}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderItem(item, () => handleToggle(item))}
        style={[
          globalStyles.tagContainer,
          {
            backgroundColor: colors.backgroundBase,
            borderColor: colors.textOnBase,
            borderWidth: 1,
          },
        ]}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default VictoryInput;
