"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRequest = exports.approveRequest = exports.viewPendingRequests = exports.viewUserRequests = exports.submitRequest = void 0;
const requestService_1 = __importDefault(require("./requestService"));
const requestModel_1 = __importDefault(require("./requestModel")); // renommé
const fileModel_1 = __importDefault(require("../file/fileModel"));
const submitRequest = async (req, res) => {
    try {
        console.log('Corps de la requête (req.body) :', req.body);
        console.log('Fichier reçu (req.file) :', req.file);
        // Vérifie que req.user existe
        if (!req.user) {
            res.status(401).json({ error: 'Utilisateur non authentifié.' });
            return;
        }
        const { type, description, startDate, endDate, service, natureConge, periodeFrais, montantFrais, incidentDescription, } = req.body;
        // Validation basique
        if (!type) {
            res.status(400).json({ error: 'Le type de demande est obligatoire.' });
            return;
        }
        if (type === 'Congé' && !startDate) {
            res.status(400).json({ error: 'Une date de début est obligatoire pour ce type.' });
            return;
        }
        // Validation conditionnelle
        switch (type) {
            case 'Congé':
                if (!natureConge) {
                    res.status(400).json({ error: 'La nature du congé est obligatoire.' });
                    return;
                }
                break;
            case 'Note de Frais':
                if (!periodeFrais || !montantFrais) {
                    res.status(400).json({ error: 'La période et le montant sont obligatoires.' });
                    return;
                }
                break;
            case 'Incident':
                if (!incidentDescription) {
                    res.status(400).json({ error: 'La description est obligatoire pour un incident.' });
                    return;
                }
                break;
            case 'Autre Demande':
                // Pas de validation supplémentaire
                break;
            default:
                res.status(400).json({ error: 'Type de demande non reconnu.' });
                return;
        }
        // Création d'un document Mongoose avec le modèle RequestModel
        const request = new requestModel_1.default({
            userId: req.user.id, // req.user vient de l'authMiddleware
            type,
            description: description || '',
            startDate: startDate || null,
            endDate: endDate || null,
            service: service || null,
            natureConge: natureConge || null,
            periodeFrais: periodeFrais || null,
            montantFrais: montantFrais || null,
            incidentDescription: incidentDescription || null,
        });
        await request.save();
        // Gestion d'un fichier uploadé (req.file)
        if (req.file) {
            const newFile = new fileModel_1.default({
                filename: req.file.filename,
                originalName: req.file.originalname,
                fileType: req.file.mimetype,
                filePath: req.file.path,
                userId: req.user.id,
                requestId: request._id, // On utilise _id généré par Mongoose
            });
            await newFile.save();
            request.files = [newFile._id];
            await request.save();
        }
        res.status(201).json({
            message: 'Demande soumise avec succès.',
            request,
        });
    }
    catch (error) {
        console.error('Erreur lors de la soumission de la demande :', error.message);
        res.status(500).json({
            error: `Erreur lors de la création de la demande : ${error.message}`,
        });
    }
};
exports.submitRequest = submitRequest;
const viewUserRequests = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Utilisateur non authentifié.' });
            return;
        }
        const requests = await requestService_1.default.getRequestsByUser(req.user.id);
        res.status(200).json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.viewUserRequests = viewUserRequests;
const viewPendingRequests = async (req, res) => {
    try {
        const requests = await requestService_1.default.getPendingRequests();
        res.status(200).json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.viewPendingRequests = viewPendingRequests;
const approveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        // findByIdAndUpdate sur RequestModel
        const request = await requestModel_1.default.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
        if (!request) {
            res.status(404).json({ error: 'Demande introuvable.' });
            return;
        }
        res.status(200).json({ message: 'Demande approuvée avec succès.', request });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.approveRequest = approveRequest;
const rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const request = await requestService_1.default.rejectRequest(id, reason);
        res.status(200).json({ message: 'Demande rejetée avec succès.', request });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.rejectRequest = rejectRequest;
