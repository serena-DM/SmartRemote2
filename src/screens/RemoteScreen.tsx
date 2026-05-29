import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import colors from '../constants/colors';
import Dpad from '../components/Dpad';
import RemoteButton from '../components/RemoteButton';

import {TvSocketClient} from '../services/tvSocket';

import {
  startReconnect,
  stopReconnect,
} from '../services/reconnect';

export default function RemoteScreen({route, navigation}: any) {
  const {tv} = route.params;

  const [connected, setConnected] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const socketClientRef = useRef<TvSocketClient | null>(null);

  const connect = useCallback(() => {
    if (!socketClientRef.current) {
      socketClientRef.current = new TvSocketClient(
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
        (data) => {
          setLastResponse(data);
        },
      );
    }
    socketClientRef.current.connect();
  }, [tv.host, tv.port]);

  useEffect(() => {
    connect();
    return () => {
      stopReconnect();
      if (socketClientRef.current) {
        socketClientRef.current.disconnect();
        socketClientRef.current = null;
      }
    };
  }, [connect]);

  const handleSendCommand = (command: string) => {
    if (socketClientRef.current) {
      socketClientRef.current.sendCommand(command);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{tv.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={[styles.status, connected ? styles.statusConnected : styles.statusConnecting]}>
        {connected ? 'Connecté' : 'Connexion...'}
      </Text>

      {lastResponse ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>Réponse TV: {lastResponse}</Text>
        </View>
      ) : null}

      <View style={styles.remoteBody}>
        <RemoteButton
          title="POWER"
          onPress={() => handleSendCommand('POWER')}
        />

        <Dpad
          onUp={() => handleSendCommand('UP')}
          onDown={() => handleSendCommand('DOWN')}
          onLeft={() => handleSendCommand('LEFT')}
          onRight={() => handleSendCommand('RIGHT')}
          onOk={() => handleSendCommand('ENTER')}
        />

        <View style={styles.row}>
          <RemoteButton
            title="VOL+"
            onPress={() => handleSendCommand('VOLUME_UP')}
          />

          <RemoteButton
            title="VOL-"
            onPress={() => handleSendCommand('VOLUME_DOWN')}
          />
        </View>

        <View style={styles.row}>
          <RemoteButton
            title="HOME"
            onPress={() => handleSendCommand('HOME')}
          />

          <RemoteButton
            title="BACK"
            onPress={() => handleSendCommand('BACK')}
          />
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 80,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 15,
  },
  statusConnected: {
    color: colors.success,
  },
  statusConnecting: {
    color: '#ff9800',
  },
  responseContainer: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff1a',
    marginBottom: 15,
  },
  responseText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  remoteBody: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
});