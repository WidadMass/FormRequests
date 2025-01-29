import express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as userController from './userController'; // Import du contrôleur utilisateur
import { verifyToken } from '../middlewares/authMiddleware'; // Import des middlewares
import { verifyRole } from '../middlewares/verifyRole'; // Middleware de vérification des rôles
import { validateRegister } from './userMiddleware'; // Import du middleware de validation

const router = express.Router();

// Routes publiques
router.post('/login', (req: Request, res: Response) =>
  userController.loginUser(req, res)
);

// Routes protégées (nécessitent un token)
router.patch(
  '/:id/password',
  verifyToken,
  (req: Request, res: Response) =>
    userController.updatePassword(req, res)
);

// Route pour enregistrer un utilisateur
router.post(
  '/register',validateRegister,
  (req: Request, res: Response) =>
    userController.registerUser(req, res)
);

// Route pour récupérer tous les utilisateurs (accessible uniquement par ADMIN)
router.get(
  '/',
  verifyToken,
  verifyRole(['ADMIN']),
  (req: Request, res: Response) =>
    userController.getAllUsers(req, res)
);

// Route pour récupérer le profil de l'utilisateur connecté
router.get(
  '/me',
  verifyToken,
  (req: Request, res: Response) =>
    userController.getMyProfile(req, res)
)

// Route pour récupérer un utilisateur spécifique par ID
router.get(
  '/:id',
  verifyToken,
  (req: Request, res: Response) =>
    userController.getUserById(req, res)
);

// Route pour mettre à jour un utilisateur spécifique par ID
router.put(
  '/:id',
  verifyToken,
  (req: Request, res: Response) =>
    userController.updateUser(req, res)
);

// Route pour activer/désactiver un utilisateur
router.put(
  '/:userId/toggle-status',
  verifyToken,
  verifyRole(['ADMIN']),
  (req: Request, res: Response) =>
    userController.toggleUserStatus(req, res)
);

// Route pour supprimer un utilisateur (accessible uniquement par ADMIN)
router.delete(
  '/:id',
  verifyToken,
  verifyRole(['ADMIN']),
  (req: Request, res: Response) =>
    userController.deleteUser(req, res)
);

export default router; // Export du routeur
