import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';

export class TvSocketClient {
  private host: string;
  private port: number;
  private onConnected: () => void;
  private onError: () => void;
  private client: any = null;
  private isConnected: boolean = false;

  constructor(
    host: string, 
    port: number, 
    onConnected: () => void, 
    onError: () => void
  ) {
    this.host = host;
    this.port = 5555; // Port pour le protocole Google
    this.onConnected = onConnected;
    this.onError = onError;
  }

  // CETTE MÉTHODE ÉTAIT MANQUANTE OU MAL NOMMÉE
  connect() {
    if (this.client) {
      this.disconnect();
    }

    console.log(`Connexion à ${this.host}:${this.port}...`);

    try {
      this.client = TcpSocket.createConnection(
        {
          port: this.port,
          host: this.host,
          tls: false, //pas de tls pour ADB simple
          ignoreInsecure: true,
        },
        () => {
          console.log('Connecté au socket TLS !');
          this.isConnected = true;
          this.onConnected();
        }
      );

      this.client.on('error', (error: any) => {
        console.log('Erreur Socket TV:', error);
        this.isConnected = false;
        this.onError();
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.onError();
      });
      
    } catch (e) {
      console.error("Erreur création socket:", e);
      this.onError();
    }
  }

  async sendCommand(commandName: string) {
    if (!this.client || !this.isConnected) {
        console.log("Pas connecté, commande annulée");
        return;
    }

    const KEYCODES: Record<string, number> = {
      HOME: 0x03,
      BACK: 0x04,
      UP: 0x13,
      DOWN: 0x14,
      LEFT: 0x15,
      RIGHT: 0x16,
      ENTER: 0x42,
      POWER: 0x1a,
      VOLUME_UP: 0x18,
      VOLUME_DOWN: 0x19,
    };

    const code = KEYCODES[commandName];
    if (!code) return;

    try {
      // Construction du message binaire (START)
      const press = Buffer.from([0x52, 0x03, 0x08, code, 0x10, 0x01]);
      this.client.write(press);

      // Petite attente pour simuler l'appui
      await new Promise(r => setTimeout(r, 50));

      // Construction du message binaire (END)
      const release = Buffer.from([0x52, 0x03, 0x08, code, 0x10, 0x02]);
      this.client.write(release);

    } catch (error) {
      console.error("Erreur d'envoi:", error);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
    this.isConnected = false;
  }
}