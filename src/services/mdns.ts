import Zeroconf from 'react-native-zeroconf';

const zeroconf = new Zeroconf();


export const searchAndroidTV = (onFound: (device: any) => void) => {
  zeroconf.removeAllListeners('resolved');
  
  // Service officiel Google TV Remote
  zeroconf.scan('androidtvremote2', 'tcp', 'local.');

  zeroconf.on('resolved', service => {
    const device = {
      name: service.name,
      host: service.addresses[0],
      port: 6466, // Port obligatoire pour le protocole v2
    };
    onFound(device);
  });
};
export const stopSearch = () => {
  zeroconf.stop();
  zeroconf.removeAllListeners('resolved');
};

