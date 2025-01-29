import mongoose, { Schema, Document, model } from 'mongoose';

// Interface TypeScript pour représenter une demande
export interface IRequest extends Document {
  userId: mongoose.Types.ObjectId; // Référence à l'utilisateur
  type: 'Congé' | 'Note de Frais' | 'Incident' | 'Autre Demande';
  service?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  natureConge?: string; // Ex. "Annuel", "Repos compensateur"
  periodeFrais?: string; // Ex. "02/2025"
  montantFrais?: number; // Ex. 150.5
  incidentDescription?: string;
  description?: string; // Champ général de description
  files?: mongoose.Types.ObjectId[];
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  requestId?: string; // Identifiant interne unique
}

// Schéma de la demande
const requestSchema: Schema<IRequest> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Référence à l'utilisateur qui fait la demande
  },

  type: {
    type: String,
    enum: ['Congé', 'Note de Frais', 'Incident', 'Autre Demande'],
    required: true,
  },

  service: { type: String }, // Exemple : "Technique", "Commercial", etc.

  startDate: {
    type: Date,
    required: function () {
      return this.type === 'Congé';
    },
  },

  endDate: {
    type: Date,
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  natureConge: {
    type: String, // Ex. "Annuel", "Repos compensateur", etc.
  },

  periodeFrais: {
    type: String, // Ex. "02/2025" ou "février 2025"
  },

  montantFrais: {
    type: Number, // Ex. 150.5
  },

  incidentDescription: {
    type: String,
  },

  description: {
    type: String, // Champ général de description
  },

  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File', // Référence aux fichiers liés
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  requestId: {
    type: String,
    unique: true,
  },
});

// Middleware pour générer un requestId unique avant d'enregistrer une demande
requestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.models.Request.countDocuments();
    this.requestId = `REQ-${count + 1}`;
  }
  next();
});

// Créer et exporter le modèle
const Request = model<IRequest>('Request', requestSchema);
export default Request;
