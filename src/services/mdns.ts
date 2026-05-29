import Zeroconf from 'react-native-zeroconf';

const zeroconf = new Zeroconf();

export const searchAndroidTV = (
  onFound: (device: any) => void,
) => {
  zeroconf.scan('googlecast', 'tcp', 'local.');

  zeroconf.on('resolved', service => {
    const device = {
      name: service.name,
      host: service.addresses[0],
      port: service.port,
    };

    onFound(device);
  });
};

export const stopSearch = () => {
  zeroconf.stop();
};