const express = require('express');
const router = express.Router();
const requestController = require('./requestController');
const { verifyToken } = require('../middlewares/authMiddleware');  // Middleware pour vérifier l'authentification
const verifyRole = require('../middlewares/verifyRole');  // Middleware pour vérifier le rôle

// Route pour soumettre une demande (accessible par EMPLOYEE, MANAGER, ADMIN)
router.post('/submit', verifyToken, verifyRole(['EMPLOYEE', 'MANAGER', 'ADMIN']), requestController.submitRequest);

// Route pour voir les demandes d'un utilisateur (employé)
router.get('/my-requests', verifyToken, requestController.viewUserRequests);

// Route pour voir toutes les demandes en attente (accessible uniquement par MANAGER et ADMIN)
router.get('/pending', verifyToken, verifyRole(['MANAGER', 'ADMIN']), requestController.viewPendingRequests);

// Route pour approuver une demande (accessible uniquement par MANAGER et ADMIN)
router.put('/approve/:id', verifyToken, verifyRole(['MANAGER', 'ADMIN']), requestController.approveRequest);

// Route pour rejeter une demande (accessible uniquement par MANAGER et ADMIN)
router.put('/reject/:id', verifyToken, verifyRole(['MANAGER', 'ADMIN']), requestController.rejectRequest);

module.exports = router;
