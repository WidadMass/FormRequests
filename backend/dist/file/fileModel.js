"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schéma Mongoose pour le fichier
const fileSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    requestId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Request', required: true }, // Référence à une demande
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à un utilisateur
});
// Exporter le modèle Mongoose
const File = (0, mongoose_1.model)('File', fileSchema);
exports.default = File;
