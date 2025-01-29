"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'Token manquant. Accès refusé.' });
        return;
    }
    try {
        // On cast en { id: string; role: string }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Maintient la cohérence : { id, role }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};
exports.verifyToken = verifyToken;
