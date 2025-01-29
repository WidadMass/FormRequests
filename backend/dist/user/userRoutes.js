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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("./userController")); // Import du contrôleur utilisateur
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Import des middlewares
const verifyRole_1 = require("../middlewares/verifyRole"); // Middleware de vérification des rôles
const userMiddleware_1 = require("./userMiddleware"); // Import du middleware de validation
const router = express_1.default.Router();
// Routes publiques
router.post('/login', (req, res) => userController.loginUser(req, res));
// Routes protégées (nécessitent un token)
router.patch('/:id/password', authMiddleware_1.verifyToken, (req, res) => userController.updatePassword(req, res));
// Route pour enregistrer un utilisateur
router.post('/register', userMiddleware_1.validateRegister, (req, res) => userController.registerUser(req, res));
// Route pour récupérer tous les utilisateurs (accessible uniquement par ADMIN)
router.get('/', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['ADMIN']), (req, res) => userController.getAllUsers(req, res));
// Route pour récupérer le profil de l'utilisateur connecté
router.get('/me', authMiddleware_1.verifyToken, (req, res) => userController.getMyProfile(req, res));
// Route pour récupérer un utilisateur spécifique par ID
router.get('/:id', authMiddleware_1.verifyToken, (req, res) => userController.getUserById(req, res));
// Route pour mettre à jour un utilisateur spécifique par ID
router.put('/:id', authMiddleware_1.verifyToken, (req, res) => userController.updateUser(req, res));
// Route pour activer/désactiver un utilisateur
router.put('/:userId/toggle-status', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['ADMIN']), (req, res) => userController.toggleUserStatus(req, res));
// Route pour supprimer un utilisateur (accessible uniquement par ADMIN)
router.delete('/:id', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['ADMIN']), (req, res) => userController.deleteUser(req, res));
exports.default = router; // Export du routeur
