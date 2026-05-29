import TcpSocket from 'react-native-tcp-socket';

let client: any = null;

export const connectTV = (
  host: string,
  port: number,
  onConnected: () => void,
  onError: () => void,
) => {
  client = TcpSocket.createConnection(
    {
      host,
      port,
    },
    () => {
      onConnected();
    },
  );

  client.on('error', error => {
    console.log('Socket Error', error);
    onError();
  });

  client.on('close', () => {
    console.log('Connection closed');
    onError();
  });
};

export const sendCommand = (command: string) => {
  if (client) {
    client.write(command + '\n');
  }
};

export const disconnectTV = () => {
  if (client) {
    client.destroy();
  }
};