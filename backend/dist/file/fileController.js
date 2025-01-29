"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const fileModel_1 = __importDefault(require("./fileModel")); // Assurez-vous que `IFile` est défini dans fileModel
const uploadFile = async (req, res) => {
    try {
        // Vérification si aucun fichier n'est envoyé
        if (!req.file) {
            res.status(400).json({ message: 'Aucun fichier envoyé.' });
            return;
        }
        // Enregistre les détails du fichier dans la base de données
        const newFile = new fileModel_1.default({
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            filePath: req.file.path,
        });
        await newFile.save();
        res.status(201).json({
            message: 'Fichier uploadé avec succès.',
            file: newFile,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur serveur.',
            error: error.message,
        });
    }
};
exports.uploadFile = uploadFile;
