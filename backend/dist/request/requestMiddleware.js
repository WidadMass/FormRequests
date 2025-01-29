"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRequestIdMiddleware = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
// Schéma Joi pour valider les données de la requête HTTP
const validateRequestSchema = joi_1.default.object({
    // Type de demande
    type: joi_1.default.string()
        .valid('Congé', 'Note de Frais', 'Incident', 'Autre Demande')
        .required()
        .messages({
        'any.only': 'Le type de demande doit être parmi : Congé, Note de Frais, Incident, Autre Demande.',
        'any.required': 'Le type de demande est obligatoire.',
    }),
    // Description générale
    description: joi_1.default.string().allow('').optional(),
    // Champs communs
    service: joi_1.default.string().allow('').optional(), // autoriser un service optionnel
    // Date de début (exigée si type = Congé)
    startDate: joi_1.default.date().iso().when('type', {
        is: 'Congé',
        then: joi_1.default.required().messages({
            'date.base': 'La date de début doit être une date valide.',
            'any.required': 'La date de début est obligatoire pour un congé.',
        }),
        otherwise: joi_1.default.optional(),
    }),
    // Date de fin
    endDate: joi_1.default.date()
        .iso()
        .greater(joi_1.default.ref('startDate'))
        .allow(null)
        .messages({
        'date.base': 'La date de fin doit être une date valide.',
        'date.greater': 'La date de fin doit être postérieure à la date de début.',
    }),
    // ---- Champs spécifiques Congé ----
    natureConge: joi_1.default.string().when('type', {
        is: 'Congé',
        then: joi_1.default.required().messages({
            'any.required': 'La nature du congé est obligatoire pour un type "Congé".',
        }),
        otherwise: joi_1.default.forbidden(),
    }),
    // ---- Champs spécifiques Note de Frais ----
    periodeFrais: joi_1.default.string().when('type', {
        is: 'Note de Frais',
        then: joi_1.default.required().messages({
            'any.required': 'La période des frais est obligatoire pour une Note de Frais.',
        }),
        otherwise: joi_1.default.forbidden(),
    }),
    montantFrais: joi_1.default.number().when('type', {
        is: 'Note de Frais',
        then: joi_1.default.required().messages({
            'any.required': 'Le montant est obligatoire pour une Note de Frais.',
        }),
        otherwise: joi_1.default.forbidden(),
    }),
    // ---- Champs spécifiques Incident ----
    incidentDescription: joi_1.default.string().when('type', {
        is: 'Incident',
        then: joi_1.default.required().messages({
            'any.required': 'La description de l’incident est obligatoire.',
        }),
        otherwise: joi_1.default.forbidden(),
    }),
    // Fichiers (optionnels)
    files: joi_1.default.array()
        .items(joi_1.default.object({
        originalname: joi_1.default.string().required(),
        mimetype: joi_1.default.string()
            .valid('application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel' // .xls
        )
            .required()
            .messages({
            'any.only': 'Le type de fichier doit être PDF, JPEG, PNG, XLS ou XLSX.',
        }),
        size: joi_1.default.number().max(5 * 1024 * 1024).messages({
            'number.max': 'La taille du fichier ne doit pas dépasser 5 Mo.',
        }),
    }).unknown(true))
        .optional(),
});
// Middleware pour valider les requêtes HTTP
const validateRequest = (req, res, next) => {
    // Convertir les fichiers reçus en tableau pour la validation
    req.body.files = req.file ? [req.file] : [];
    const { error } = validateRequestSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json({
            message: 'Validation échouée.',
            details: error.details.map((err) => err.message),
        });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
// Middleware Mongoose : Générer un requestId unique avant d'enregistrer une demande
const addRequestIdMiddleware = (schema) => {
    schema.pre('save', async function (next) {
        if (!this.requestId) {
            const count = await mongoose_1.default.models.Request.countDocuments();
            this.requestId = `REQ-${count + 1}`;
        }
        next();
    });
};
exports.addRequestIdMiddleware = addRequestIdMiddleware;
