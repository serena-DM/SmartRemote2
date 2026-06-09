let timer: any = null;

export const startReconnect = (callback: () => void) => {
  if (timer) return;
  timer = setInterval(() => {
    console.log("Tentative de reconnexion...");
    callback();
  }, 5000);
};

export const stopReconnect = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};