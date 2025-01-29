import { createLogger, format, transports, Logger } from 'winston';

// Créer une instance du logger
const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.Console(), // Affiche les logs dans la console
    new transports.File({ filename: 'app.log' }), // Enregistre les logs dans un fichier
  ],
});

export default logger;
