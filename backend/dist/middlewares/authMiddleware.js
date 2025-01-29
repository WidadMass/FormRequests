"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 2) Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'Token manquant ou mal formaté. Accès refusé.' });
        return;
    }
    try {
        // On caste le token décodé pour qu'il contienne { id: string; role: string }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // => { id, role }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};
exports.verifyToken = verifyToken;
