import mongoose, { Schema, Document, model, Types } from 'mongoose';

// Interface TypeScript pour le fichier
export interface IFile extends Document {
  _id: Types.ObjectId;      
  filename: string;
  
  originalName: string;
  fileType: string;
  filePath: string;
  createdAt?: Date;
  requestId: mongoose.Types.ObjectId; // Référence à une demande
  userId: mongoose.Types.ObjectId;    // Référence à un utilisateur
}

// Schéma Mongoose pour le fichier
const fileSchema: Schema<IFile> = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  requestId: { type: Schema.Types.ObjectId, ref: 'Request', required: true }, // Référence à une demande
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },       // Référence à un utilisateur
});

// Exporter le modèle Mongoose
const File = model<IFile>('File', fileSchema);
export default File;
