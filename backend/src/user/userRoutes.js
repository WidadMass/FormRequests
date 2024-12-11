const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import du contrôleur utilisateur
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware'); // Import des middlewares

// Routes publiques
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Routes protégées (nécessitent un token)
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers); // Accessible uniquement aux admins
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router; // Export du routeur
