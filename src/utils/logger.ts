const LOGGING_ENABLED = true;

const logger = {
  log: (...args: any[]) => {
    if (!LOGGING_ENABLED) return;
    console.log(...args);
  },
};

export default logger;
