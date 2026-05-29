import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import colors from '../constants/colors';

export default function TvCard({
  tv,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}>
      <View>
        <Text style={styles.name}>{tv.name}</Text>
        <Text style={styles.host}>{tv.host}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  host: {
    color: colors.muted,
    marginTop: 5,
  },
});