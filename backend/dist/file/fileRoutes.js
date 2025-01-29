"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileService_1 = __importDefault(require("./fileService")); // Middleware multer configuré
const fileController_1 = require("./fileController"); // Contrôleur pour gérer l'upload
const router = express_1.default.Router();
// Endpoint pour uploader un fichier
router.post('/upload', fileService_1.default.single('file'), fileController_1.uploadFile);
exports.default = router;
