import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../constants/colors';
import Dpad from '../components/Dpad';
import RemoteButton from '../components/RemoteButton';

import {
  connectTV,
  sendCommand,
} from '../services/tvSocket';

import {
  startReconnect,
  stopReconnect,
} from '../services/reconnect';

export default function RemoteScreen({route}: any) {
  const {tv} = route.params;

  const [connected, setConnected] = useState(false);

  const connect = () => {
    connectTV(
      tv.host,
      tv.port,
      () => {
        setConnected(true);
        stopReconnect();
      },
      () => {
        setConnected(false);
        startReconnect(connect);
      },
    );
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tv.name}</Text>

      <Text style={styles.status}>
        {connected ? 'Connecté' : 'Connexion...'}
      </Text>

      <RemoteButton
        title="POWER"
        onPress={() => sendCommand('POWER')}
      />

      <Dpad
        onUp={() => sendCommand('UP')}
        onDown={() => sendCommand('DOWN')}
        onLeft={() => sendCommand('LEFT')}
        onRight={() => sendCommand('RIGHT')}
        onOk={() => sendCommand('ENTER')}
      />

      <View style={styles.row}>
        <RemoteButton
          title="VOL+"
          onPress={() => sendCommand('VOLUME_UP')}
        />

        <RemoteButton
          title="VOL-"
          onPress={() => sendCommand('VOLUME_DOWN')}
        />
      </View>

      <View style={styles.row}>
        <RemoteButton
          title="HOME"
          onPress={() => sendCommand('HOME')}
        />

        <RemoteButton
          title="BACK"
          onPress={() => sendCommand('BACK')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  status: {
    color: colors.success,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
  },
});