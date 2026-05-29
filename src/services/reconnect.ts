let reconnectInterval: any = null;

export const startReconnect = (reconnectFn: () => void) => {
  if (reconnectInterval) {
    return; // Évite de multiplier les timers si déjà en cours
  }

  reconnectInterval = setInterval(() => {
    reconnectFn();
  }, 5000);
};

export const stopReconnect = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null; // Nettoie proprement la référence
  }
};