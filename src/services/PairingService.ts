// src/services/PairingService.ts

/**
 * Envoie le code PIN à la TV pour valider l'appairage
 * @param client Le socket TLS ouvert sur le port 6467
 * @param pin Le code affiché sur la TV (ex: "A1B2C3")
 */
export const sendPinCode = (client: any, pin: string) => {
  try {
    // 1. Conversion du PIN en bytes
    // Note: Dans le protocole réel, le PIN est souvent hashé avec des nonces.
    // Voici la structure simplifiée du message SecretResponse (ID 4)
    const pinBuffer = Buffer.from(pin, 'utf-8');

    // 2. Construction du message Protobuf binaire
    // [0x08] = Field 1 (Type)
    // [0x02] = SecretResponse
    // [0x12] = Field 2 (Payload)
    // [0x06] = Longueur du code PIN (6 caractères)
    const header = Buffer.from([0x08, 0x02, 0x12, pinBuffer.length]);
    const packet = Buffer.concat([header, pinBuffer]);

    // 3. Envoi du paquet
    client.write(packet);
    console.log("Secret envoyé à la TV...");

  } catch (error) {
    console.error("Erreur lors de l'envoi du PIN:", error);
  }
};