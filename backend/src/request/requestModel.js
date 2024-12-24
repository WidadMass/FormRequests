const mongoose = require('mongoose');
const requestController = require('./requestController');
const { verifyToken } = require('../middlewares/authMiddleware');  // Auth middleware
const verifyRole = require('../middlewares/verifyRole');  // Middleware pour vérifier le rôle

// Définir le schéma de la demande
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Référence à l'utilisateur qui a fait la demande
    required: true
  },
  type: {
    type: String,
    enum: ['Congé', 'Note de Frais','Autre Demande'], // Exemple de types de demande
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], // Statuts de la demande
    default: 'Pending'
  },
  reason: { 
    type: String  // Motif d'approbation ou de rejet
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Créer le modèle de demande
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
