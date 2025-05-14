import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './Default';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonPrimary} onPress={onPress}>
      <Text style={styles.buttonPrimaryText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonPrimary;
