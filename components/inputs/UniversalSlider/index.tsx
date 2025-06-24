// components/UniversalSlider/index.tsx
import Slider from '@react-native-community/slider';
import React from 'react';
import { Platform, StyleSheet, Text, View, AccessibilityProps } from 'react-native';

type Props = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
} & AccessibilityProps;

const UniversalSlider: React.FC<Props> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
  disabled = false,
  showValue = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          style={styles.webSlider as React.CSSProperties}
          aria-label={accessibilityLabel}
          aria-disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        {showValue && <Text style={styles.valueText}>{value.toFixed(2)}</Text>}
      </View>
    );
  }

  return (
    <View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      />
      {showValue && <Text style={styles.valueText}>{value.toFixed(2)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  webSlider: {
    width: '100%',
  },
  valueText: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default UniversalSlider;
