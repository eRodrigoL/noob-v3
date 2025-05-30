// components/feedback/NoResults/index.tsx
import ButtonHighlight from '@components/buttons/ButtonHighlight';
import { useTheme } from '@theme/index';
import { Text, View } from 'react-native';
import stylesNoResults from './styles';

interface NoResultsProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const NoResults = ({ message, actionText, onAction }: NoResultsProps) => {
  const { colors, fontSizes, fontFamily } = useTheme();

  return (
    <View
      style={stylesNoResults.container}
      accessible
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <Text
        style={[
          stylesNoResults.message,
          { fontFamily, fontSize: fontSizes.base, color: colors.textOnBase },
        ]}
      >
        {message}
      </Text>
      {actionText && onAction && (
        <ButtonHighlight
          title={actionText}
          onPress={onAction}
        />
      )}
    </View>
  );
};

export default NoResults;
