/**
 * 🔒 Logger sécurisé - N'affiche les logs qu'en développement
 * Évite l'exposition d'informations sensibles en production
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args) => {
    // Les erreurs sont toujours loggées (important pour monitoring)
    console.error(...args);
  },

  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },

  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};

export default logger;
