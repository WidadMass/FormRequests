"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./user/userRoutes"));
const requestRoutes_1 = __importDefault(require("./request/requestRoutes")); // Importer les routes pour les demandes
const fileRoutes_1 = __importDefault(require("./file/fileRoutes")); // Importer les routes pour les fichiers
const app = (0, express_1.default)(); // Typage explicite de l'application Express
// Servir les fichiers depuis le dossier 'uploads'
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// Middleware global
app.use((0, cors_1.default)());
// Middleware pour analyser les données JSON
app.use(body_parser_1.default.json());
// Middleware pour analyser les données x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes utilisateur
app.use('/api/users', userRoutes_1.default);
// Routes pour les demandes
app.use('/api/requests', requestRoutes_1.default);
// Routes pour les fichiers
app.use('/api/files', fileRoutes_1.default);
exports.default = app; // Export de l'application pour une utilisation dans d'autres fichiers
