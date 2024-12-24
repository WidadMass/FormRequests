const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import du contrôleur utilisateur
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware'); // Import des middlewares
const verifyRole = require('../middlewares/verifyRole');

// Routes publiques
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Routes protégées (nécessitent un token)
// Route pour récupérer tous les utilisateurs (accessible uniquement par ADMIN)
router.get('/', verifyToken, verifyRole(['ADMIN']), userController.getAllUsers);
router.get('/me', verifyToken, userController.getMyProfile);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);

// Route pour supprimer un utilisateur (accessible uniquement par ADMIN)
router.delete('/:id', verifyToken, verifyRole(['ADMIN']), userController.deleteUser);

module.exports = router; // Export du routeur
