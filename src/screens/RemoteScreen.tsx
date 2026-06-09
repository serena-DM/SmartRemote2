import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Vibration,
  NativeModules,
  ScrollView,
} from 'react-native';
import {TvSocketClient} from '../services/tvSocket';
import {startReconnect, stopReconnect} from '../services/reconnect';

// Accès au module Infrarouge que nous allons créer en Java
const { IrModule } = NativeModules;

const COLORS = {
  DARK: '#0D0D0D',
  DARK2: '#1A1A2E',
  RED: '#E50914',
  GRAY: '#2A2A3E',
  LIGHT: '#FFFFFF',
  GREEN: '#2ECC71',
  ORANGE: '#E67E22',
};

// Codes IR standards (Format NEC - à adapter pour INNOVA)
const IR_PATTERNS: any = {
  POWER: [9000, 4500, 560, 1690, 560, 560, 560, 560], 
  VOLUME_UP: [9000, 4500, 560, 1690, 560, 1690, 560, 560],
  VOLUME_DOWN: [9000, 4500, 560, 560, 560, 1690, 560, 560],
  HOME: [9000, 4500, 560, 1690, 560, 560, 560, 1690],
};

export default function RemoteScreen({route, navigation}: any) {
  const {tv} = route.params;
  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState<'WIFI' | 'IR'>('WIFI'); // Mode hybride
  const socketClientRef = useRef<TvSocketClient | null>(null);

  // --- LOGIQUE DE CONNEXION WIFI ---
  const connectWifi = useCallback(() => {
    if (mode !== 'WIFI') return;

    try {
      if (!socketClientRef.current) {
        socketClientRef.current = new TvSocketClient(
          tv.host, tv.port,
          () => { setConnected(true); stopReconnect(); },
          () => { setConnected(false); startReconnect(connectWifi); }
        );
      }
      socketClientRef.current.connect();
    } catch (e) {
      console.error("Erreur WiFi:", e);
    }
  }, [tv.host, tv.port, mode]);

  useEffect(() => {
    if (mode === 'WIFI') connectWifi();
    return () => {
      stopReconnect();
      if (socketClientRef.current) socketClientRef.current.disconnect();
    };
  }, [connectWifi, mode]);

  // --- LOGIQUE D'ENVOI HYBRIDE ---
  const handleCommand = (cmd: string) => {
    Vibration.vibrate(40);
    
    if (mode === 'WIFI') {
      // Envoi via Socket TCP (Android TV)
      if (socketClientRef.current && connected) {
        socketClientRef.current.sendCommand(cmd);
      }
    } else {
      // Envoi via Infrarouge (TV INNOVA)
      if (IrModule) {
        const pattern = IR_PATTERNS[cmd] || IR_PATTERNS['POWER'];
        IrModule.transmit(38000, pattern);
      } else {
        console.warn("Module IR non disponible sur ce téléphone");
      }
    }
  };

  // --- COMPOSANTS UI RÉUTILISABLES ---
  const ControlBtn = ({label, cmd, size = 60, color = COLORS.GRAY}: any) => (
    <TouchableOpacity
      style={[styles.circleBtn, {width: size, height: size, backgroundColor: color}]}
      onPress={() => handleCommand(cmd)}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header avec Switch de Mode */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.tvName}>{tv.name}</Text>
          <TouchableOpacity 
            onPress={() => setMode(mode === 'WIFI' ? 'IR' : 'WIFI')}
            style={[styles.modeBadge, {backgroundColor: mode === 'WIFI' ? COLORS.RED : COLORS.GRAY}]}>
            <Text style={styles.modeText}>{mode}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.statusDot, {backgroundColor: connected || mode === 'IR' ? COLORS.GREEN : COLORS.ORANGE}]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        
        {/* Section Power */}
        <View style={styles.mainRow}>
          <ControlBtn label="⏻" cmd="POWER" color={COLORS.RED} size={70} />
        </View>

        {/* Section Navigation (D-PAD) */}
        <View style={styles.dpadContainer}>
          <ControlBtn label="▲" cmd="UP" />
          <View style={styles.row}>
            <ControlBtn label="◀" cmd="LEFT" />
            <ControlBtn label="OK" cmd="ENTER" color={COLORS.RED} size={80} />
            <ControlBtn label="▶" cmd="RIGHT" />
          </View>
          <ControlBtn label="▼" cmd="DOWN" />
        </View>

        {/* Section Volume & Contrôles */}
        <View style={styles.controlsGrid}>
          <View style={styles.col}>
            <ControlBtn label="VOL+" cmd="VOLUME_UP" size={55} />
            <Text style={styles.label}>VOL</Text>
            <ControlBtn label="VOL-" cmd="VOLUME_DOWN" size={55} />
          </View>
          
          <View style={styles.col}>
            <TouchableOpacity style={styles.wideBtn} onPress={() => handleCommand('HOME')}>
              <Text style={styles.btnText}>HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.wideBtn} onPress={() => handleCommand('BACK')}>
              <Text style={styles.btnText}>BACK</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      <Text style={styles.footerStatus}>
        {mode === 'WIFI' 
          ? (connected ? '● MODE WIFI CONNECTÉ' : '○ RECHERCHE WIFI...') 
          : '● MODE INFRAROUGE ACTIF'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.DARK},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: COLORS.DARK2
  },
  headerTitle: {alignItems: 'center'},
  backArrow: {color: COLORS.LIGHT, fontSize: 30},
  tvName: {color: COLORS.LIGHT, fontSize: 18, fontWeight: 'bold'},
  modeBadge: {paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, marginTop: 5},
  modeText: {color: COLORS.LIGHT, fontSize: 10, fontWeight: 'bold'},
  statusDot: {width: 12, height: 12, borderRadius: 6},
  
  scrollArea: {alignItems: 'center', paddingVertical: 30},
  mainRow: {marginBottom: 30},
  
  dpadContainer: {alignItems: 'center', marginBottom: 40},
  row: {flexDirection: 'row', alignItems: 'center', marginVertical: 10},
  
  controlsGrid: {flexDirection: 'row', width: '80%', justifyContent: 'space-around', alignItems: 'center'},
  col: {alignItems: 'center', justifyContent: 'space-between', height: 160},
  
  circleBtn: {
    borderRadius: 40, alignItems: 'center', justifyContent: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  wideBtn: {
    backgroundColor: COLORS.GRAY, paddingVertical: 15, paddingHorizontal: 30,
    borderRadius: 15, marginVertical: 5, width: 120, alignItems: 'center'
  },
  btnText: {color: COLORS.LIGHT, fontWeight: 'bold', fontSize: 14},
  label: {color: COLORS.MUTED, marginVertical: 10, fontSize: 12},
  footerStatus: {color: COLORS.LIGHT, fontSize: 11, marginBottom: 20, opacity: 0.6, textAlign: 'center'}
});