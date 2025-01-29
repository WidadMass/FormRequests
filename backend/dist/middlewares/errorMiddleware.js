"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        res.status(400).json({
            message: 'Les données envoyées sont invalides.',
            details: err.details,
        });
        return;
    }
    if (err.code === 11000) {
        res.status(409).json({
            message: 'Cet email est déjà pris.',
        });
        return;
    }
    res.status(500).json({ message: err.message || 'Erreur serveur.' });
};
exports.errorMiddleware = errorMiddleware;
