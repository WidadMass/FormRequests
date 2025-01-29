import express, { Request, Response } from 'express';
import { validateRequest } from './requestMiddleware';
import * as requestController from './requestController';
import { verifyToken } from '../middlewares/authMiddleware'; // Vérifie si l'utilisateur est authentifié
import { verifyRole } from '../middlewares/verifyRole'; // Vérifie le rôle de l'utilisateur
import upload from '../file/fileService';
import * as RequestService from './requestService';

const router = express.Router();

// Route pour soumettre une demande avec un seul fichier
router.post(
  '/submit',
  verifyToken,
  verifyRole(['EMPLOYEE', 'MANAGER', 'ADMIN']),
  upload.single('file'), 
  validateRequest,
  requestController.submitRequest
);

// Route pour voir les demandes d'un utilisateur connecté (employé)
router.get(
  '/my-requests',
  verifyToken,
  requestController.viewUserRequests
);

// Route pour voir toutes les demandes en attente (accessible uniquement par MANAGER et ADMIN)
router.get(
  '/pending',
  verifyToken,
  verifyRole(['MANAGER', 'ADMIN']),
  requestController.viewPendingRequests
);

// Route pour approuver une demande (accessible uniquement par MANAGER et ADMIN)
router.put(
  '/approve/:id',
  verifyToken,
  verifyRole(['MANAGER', 'ADMIN']),
  requestController.approveRequest
);

// Route pour rejeter une demande (accessible uniquement par MANAGER et ADMIN)
router.put(
  '/reject/:id',
  verifyToken,
  verifyRole(['MANAGER', 'ADMIN']),
  requestController.rejectRequest
);

// Route pour récupérer les demandes d'un service spécifique
router.get('/service/:serviceName', async (req: Request, res: Response) => {
  try {
    const { serviceName } = req.params;
    const requests = await RequestService.getRequestsByService(serviceName);
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
