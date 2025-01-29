"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsByService = getRequestsByService;
const requestModel_1 = __importDefault(require("./requestModel")); // Assurez-vous que IRequest est défini dans requestModel
const RequestService = {
    /**
     * Crée une nouvelle demande
     * @param {Partial<IRequest>} requestData - Les données de la demande
     * @returns {Promise<IRequest>} - La demande créée
     */
    async createRequest(requestData) {
        try {
            const request = new requestModel_1.default(requestData);
            return await request.save();
        }
        catch (error) {
            throw new Error(`Erreur lors de la création de la demande : ${error.message}`);
        }
    },
    /**
     * Récupère les demandes d'un utilisateur
     * @param {string | Types.ObjectId} userId - ID de l'utilisateur
     * @returns {Promise<IRequest[]>} - Liste des demandes de l'utilisateur
     */
    async getRequestsByUser(userId) {
        try {
            return await requestModel_1.default.find({ userId })
                .populate('files')
                .populate('userId', 'firstName lastName email')
                .sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des demandes : ${error.message}`);
        }
    },
    /**
     * Récupère toutes les demandes en attente
     * @returns {Promise<IRequest[]>} - Liste des demandes en attente
     */
    async getPendingRequests() {
        try {
            return await requestModel_1.default.find({ status: 'Pending' })
                .populate('files')
                .populate('userId', 'firstName lastName email')
                .sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des demandes en attente : ${error.message}`);
        }
    },
    /**
     * Approuve une demande
     * @param {string | Types.ObjectId} requestId - ID de la demande
     * @returns {Promise<IRequest>} - La demande mise à jour
     */
    async approveRequest(requestId) {
        try {
            const request = await requestModel_1.default.findById(requestId);
            if (!request) {
                throw new Error('Demande introuvable.');
            }
            request.status = 'Approved';
            return await request.save();
        }
        catch (error) {
            throw new Error(`Erreur lors de l'approbation de la demande : ${error.message}`);
        }
    },
    /**
     * Rejette une demande
     * @param {string | Types.ObjectId} requestId - ID de la demande
     * @param {string} reason - Motif du rejet
     * @returns {Promise<IRequest>} - La demande mise à jour
     */
    async rejectRequest(requestId, reason) {
        try {
            const request = await requestModel_1.default.findById(requestId);
            if (!request) {
                throw new Error('Demande introuvable.');
            }
            request.status = 'Rejected';
            request.reason = reason; // Ajoutez "reason" si ce champ n'est pas dans IRequest
            return await request.save();
        }
        catch (error) {
            throw new Error(`Erreur lors du rejet de la demande : ${error.message}`);
        }
    },
    /**
     * Récupère toutes les demandes d'un service particulier
     * @param {string} serviceName - Nom du service
     * @returns {Promise<IRequest[]>} - Liste des demandes liées à ce service
     */
    async getRequestsByService(serviceName) {
        try {
            return await requestModel_1.default.find({ service: serviceName })
                .populate('files')
                .populate('userId', 'firstName lastName email')
                .sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Erreur lors de la récupération des demandes par service : ${error.message}`);
        }
    },
};
exports.default = RequestService;
function getRequestsByService(serviceName) {
    throw new Error('Function not implemented.');
}
