"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app")); // Charger Express
const db_1 = __importDefault(require("./config/db")); // Charger MongoDB
// Charger les variables d'environnement
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Connexion à MongoDB
(0, db_1.default)()
    .then(() => {
    // Démarrer le serveur uniquement après la connexion à la base de données
    app_1.default.listen(PORT, () => {
        console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
})
    .catch((error) => {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    process.exit(1); // Arrêter le processus si la base de données ne se connecte pas
});
