import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../constants/colors';

interface Props {
  onUp: () => void;
  onDown: () => void;
  onLeft: () => void;
  onRight: () => void;
  onOk: () => void;
}

export default function Dpad(props: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={props.onUp}>
        <Text style={styles.text}>↑</Text>
      </TouchableOpacity>

      <View style={styles.middleRow}>
        <TouchableOpacity style={styles.btn} onPress={props.onLeft}>
          <Text style={styles.text}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.okBtn} onPress={props.onOk}>
          <Text style={styles.text}>OK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={props.onRight}>
          <Text style={styles.text}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={props.onDown}>
        <Text style={styles.text}>↓</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
  },

  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },

  okBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },

  text: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});