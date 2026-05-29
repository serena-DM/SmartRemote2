import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

import colors from '../constants/colors';
import TvCard from '../components/TvCard';
import {searchAndroidTV} from '../services/mdns';

export default function HomeScreen({navigation}: any) {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    searchAndroidTV(device => {
      setDevices(prev => {
        const exists = prev.find(d => d.host === device.host);

        if (exists) {
          return prev;
        }

        return [...prev, device];
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Remote</Text>

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
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});