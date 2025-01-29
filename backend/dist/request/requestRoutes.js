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
const requestMiddleware_1 = require("./requestMiddleware");
const requestController = __importStar(require("./requestController"));
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Vérifie si l'utilisateur est authentifié
const verifyRole_1 = require("../middlewares/verifyRole"); // Vérifie le rôle de l'utilisateur
const fileService_1 = __importDefault(require("../file/fileService"));
const RequestService = __importStar(require("./requestService"));
const router = express_1.default.Router();
// Route pour soumettre une demande avec un seul fichier
router.post('/submit', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['EMPLOYEE', 'MANAGER', 'ADMIN']), fileService_1.default.single('file'), requestMiddleware_1.validateRequest, requestController.submitRequest);
// Route pour voir les demandes d'un utilisateur connecté (employé)
router.get('/my-requests', authMiddleware_1.verifyToken, requestController.viewUserRequests);
// Route pour voir toutes les demandes en attente (accessible uniquement par MANAGER et ADMIN)
router.get('/pending', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['MANAGER', 'ADMIN']), requestController.viewPendingRequests);
// Route pour approuver une demande (accessible uniquement par MANAGER et ADMIN)
router.put('/approve/:id', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['MANAGER', 'ADMIN']), requestController.approveRequest);
// Route pour rejeter une demande (accessible uniquement par MANAGER et ADMIN)
router.put('/reject/:id', authMiddleware_1.verifyToken, (0, verifyRole_1.verifyRole)(['MANAGER', 'ADMIN']), requestController.rejectRequest);
// Route pour récupérer les demandes d'un service spécifique
router.get('/service/:serviceName', async (req, res) => {
    try {
        const { serviceName } = req.params;
        const requests = await RequestService.getRequestsByService(serviceName);
        res.status(200).json(requests);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
