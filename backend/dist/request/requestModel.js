"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schéma de la demande
const requestSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Référence à l'utilisateur qui fait la demande
    },
    type: {
        type: String,
        enum: ['Congé', 'Note de Frais', 'Incident', 'Autre Demande'],
        required: true,
    },
    service: { type: String }, // Exemple : "Technique", "Commercial", etc.
    startDate: {
        type: Date,
        required: function () {
            return this.type === 'Congé';
        },
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    natureConge: {
        type: String, // Ex. "Annuel", "Repos compensateur", etc.
    },
    periodeFrais: {
        type: String, // Ex. "02/2025" ou "février 2025"
    },
    montantFrais: {
        type: Number, // Ex. 150.5
    },
    incidentDescription: {
        type: String,
    },
    description: {
        type: String, // Champ général de description
    },
    files: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'File', // Référence aux fichiers liés
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    requestId: {
        type: String,
        unique: true,
    },
});
// Middleware pour générer un requestId unique avant d'enregistrer une demande
requestSchema.pre('save', async function (next) {
    if (!this.requestId) {
        const count = await mongoose_1.default.models.Request.countDocuments();
        this.requestId = `REQ-${count + 1}`;
    }
    next();
});
// Créer et exporter le modèle
const Request = (0, mongoose_1.model)('Request', requestSchema);
exports.default = Request;
