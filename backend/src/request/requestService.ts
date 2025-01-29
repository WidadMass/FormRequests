import Request, { IRequest } from './requestModel'; // Assurez-vous que IRequest est défini dans requestModel
import User from '../user/userModel'; // Import du modèle utilisateur
import { Types } from 'mongoose';

const RequestService = {
  /**
   * Crée une nouvelle demande
   * @param {Partial<IRequest>} requestData - Les données de la demande
   * @returns {Promise<IRequest>} - La demande créée
   */
  async createRequest(requestData: Partial<IRequest>): Promise<IRequest> {
    try {
      const request = new Request(requestData);
      return await request.save();
    } catch (error: any) {
      throw new Error(`Erreur lors de la création de la demande : ${error.message}`);
    }
  },

  /**
   * Récupère les demandes d'un utilisateur
   * @param {string | Types.ObjectId} userId - ID de l'utilisateur
   * @returns {Promise<IRequest[]>} - Liste des demandes de l'utilisateur
   */
  async getRequestsByUser(userId: string | Types.ObjectId): Promise<IRequest[]> {
    try {
      return await Request.find({ userId })
        .populate('files')
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Erreur lors de la récupération des demandes : ${error.message}`);
    }
  },

  /**
   * Récupère toutes les demandes en attente
   * @returns {Promise<IRequest[]>} - Liste des demandes en attente
   */
  async getPendingRequests(): Promise<IRequest[]> {
    try {
      return await Request.find({ status: 'Pending' })
        .populate('files')
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Erreur lors de la récupération des demandes en attente : ${error.message}`);
    }
  },

  /**
   * Approuve une demande
   * @param {string | Types.ObjectId} requestId - ID de la demande
   * @returns {Promise<IRequest>} - La demande mise à jour
   */
  async approveRequest(requestId: string | Types.ObjectId): Promise<IRequest> {
    try {
      const request = await Request.findById(requestId);
      if (!request) {
        throw new Error('Demande introuvable.');
      }
      request.status = 'Approved';
      return await request.save();
    } catch (error: any) {
      throw new Error(`Erreur lors de l'approbation de la demande : ${error.message}`);
    }
  },

  /**
   * Rejette une demande
   * @param {string | Types.ObjectId} requestId - ID de la demande
   * @param {string} reason - Motif du rejet
   * @returns {Promise<IRequest>} - La demande mise à jour
   */
  async rejectRequest(requestId: string | Types.ObjectId, reason: string): Promise<IRequest> {
    try {
      const request = await Request.findById(requestId);
      if (!request) {
        throw new Error('Demande introuvable.');
      }
      request.status = 'Rejected';
      (request as any).reason = reason; // Ajoutez "reason" si ce champ n'est pas dans IRequest
      return await request.save();
    } catch (error: any) {
      throw new Error(`Erreur lors du rejet de la demande : ${error.message}`);
    }
  },

  /**
   * Récupère toutes les demandes d'un service particulier
   * @param {string} serviceName - Nom du service
   * @returns {Promise<IRequest[]>} - Liste des demandes liées à ce service
   */
  async getRequestsByService(serviceName: string): Promise<IRequest[]> {
    try {
      return await Request.find({ service: serviceName })
        .populate('files')
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Erreur lors de la récupération des demandes par service : ${error.message}`);
    }
  },
};

export default RequestService;

export function getRequestsByService(serviceName: string) {
  throw new Error('Function not implemented.');
}
