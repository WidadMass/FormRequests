"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        // On "force" le type string pour process.env.MONGO_URI 
        // (tu peux ajuster si tu souhaites une gestion d'erreur plus fine)
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            dbName: 'RequestDB',
        });
        console.log('MongoDB connecté avec succès');
    }
    catch (error) {
        // Ici, on cast `error` en `Error` pour récupérer `error.message`
        console.error('Erreur de connexion MongoDB :', error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
