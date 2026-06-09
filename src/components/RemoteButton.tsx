import { NativeModules, Alert } from 'react-native';
const { AdbModule } = NativeModules;

// 1. Fonction pour se connecter
const connectToTv = async (ip: string) => {
  try {
    console.log("Tentative de connexion ADB...");
    const status = await AdbModule.connect(ip);
    console.log("Status:", status);
    // Ici, regardez votre TV, elle va demander une autorisation !
  } catch (e) {
    Alert.alert("Erreur", "Impossible de se connecter à la TV. Vérifiez le port 5555.");
  }
};

// 2. Fonction pour envoyer une touche
const pressKey = async (adbKeyCode: number) => {
  try {
    await AdbModule.sendKey(adbKeyCode);
  } catch (e) {
    console.log("Erreur d'envoi", e);
  }
};

// ... Dans votre rendu (bouton)
<TouchableOpacity onPress={() => pressKey(19)}> 
  <Text>HAUT (UP)</Text>
</TouchableOpacity>