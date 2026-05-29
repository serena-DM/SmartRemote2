import TcpSocket from 'react-native-tcp-socket';

export class TvSocketClient {
  private client: any = null;
  private host: string;
  private port: number;
  private onConnected: () => void;
  private onError: () => void;
  private onData?: (data: string) => void;
  private hasFailed: boolean = false;

  constructor(
    host: string,
    port: number,
    onConnected: () => void,
    onError: () => void,
    onData?: (data: string) => void,
  ) {
    this.host = host;
    this.port = port;
    this.onConnected = onConnected;
    this.onError = onError;
    this.onData = onData;
  }

  connect() {
    this.hasFailed = false;
    try {
      this.client = TcpSocket.createConnection(
        {
          host: this.host,
          port: this.port,
        },
        () => {
          if (!this.hasFailed) {
            console.log('TCP Connection established with', this.host);
            this.onConnected();
          }
        },
      );

      this.client.on('data', (data: any) => {
        const message = data.toString().trim();
        console.log('Received data from TV:', message);
        if (this.onData) {
          this.onData(message);
        }
      });

      this.client.on('error', (error: any) => {
        console.log('Socket Error:', error);
        this.handleFailure();
      });

      this.client.on('close', () => {
        console.log('Socket closed');
        this.handleFailure();
      });
    } catch (err) {
      console.error('Failed to create TCP connection:', err);
      this.handleFailure();
    }
  }

  private handleFailure() {
    if (!this.hasFailed) {
      this.hasFailed = true;
      this.onError();
    }
  }

  sendCommand(command: string) {
    if (this.client) {
      try {
        this.client.write(command + '\n');
      } catch (err) {
        console.error('Error writing command:', err);
        this.handleFailure();
      }
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.destroy();
      } catch (err) {
        console.error('Error destroying socket:', err);
      }
      this.client = null;
    }
  }
}