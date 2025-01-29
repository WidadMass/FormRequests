"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Créer une instance du logger
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [
        new winston_1.transports.Console(), // Affiche les logs dans la console
        new winston_1.transports.File({ filename: 'app.log' }), // Enregistre les logs dans un fichier
    ],
});
exports.default = logger;
