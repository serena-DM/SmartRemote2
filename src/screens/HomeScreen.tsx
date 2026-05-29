import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import colors from '../constants/colors';
import TvCard from '../components/TvCard';
import {searchAndroidTV, stopSearch} from '../services/mdns';

export default function HomeScreen({navigation}: any) {
  const [devices, setDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startScan = useCallback(() => {
    // Nettoyer le scan précédent s'il y en a un
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    stopSearch();

    setIsScanning(true);
    setDevices([]);

    searchAndroidTV(device => {
      setDevices(prev => {
        const exists = prev.find(d => d.host === device.host);

        if (exists) {
          return prev;
        }

        return [...prev, device];
      });
    });

    // Arrêter automatiquement la recherche après 5 secondes pour préserver la batterie
    scanTimeoutRef.current = setTimeout(() => {
      stopSearch();
      setIsScanning(false);
    }, 5000);
  }, []);

  useEffect(() => {
    startScan();

    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      stopSearch();
    };
  }, [startScan]);

  const renderEmptyComponent = () => {
    if (isScanning) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Recherche de téléviseurs en cours...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTextTitle}>Aucun téléviseur trouvé</Text>
        <Text style={styles.emptyTextSub}>
          Vérifiez que votre téléviseur est allumé et connecté au même réseau Wi-Fi.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={startScan}>
          <Text style={styles.retryButtonText}>Relancer la recherche</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Remote</Text>
        {isScanning && devices.length > 0 && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>

      <FlatList
        data={devices}
        keyExtractor={item => item.host}
        renderItem={({item}) => (
          <TvCard
            tv={item}
            onPress={() =>
              navigation.navigate('Remote', {
                tv: item,
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isScanning}
            onRefresh={startScan}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={devices.length === 0 ? styles.listEmpty : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: colors.muted,
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyTextTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyTextSub: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});