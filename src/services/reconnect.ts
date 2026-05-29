let reconnectInterval: any = null;

export const startReconnect = (
  reconnectFn: () => void,
) => {
  reconnectInterval = setInterval(() => {
    reconnectFn();
  }, 5000);
};

export const stopReconnect = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
};