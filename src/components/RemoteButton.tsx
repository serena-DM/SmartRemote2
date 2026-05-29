import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
}

export default function RemoteButton({
  title,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  text: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});