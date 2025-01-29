import mongoose, { Schema, Document } from 'mongoose';

// Définir une interface pour typer un utilisateur
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
  service: 'Technique' | 'Commercial' | 'Administration';
  isActive: boolean;
  createdAt: Date;
}

// Définir le schéma de l'utilisateur
const userSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    default: null,
    validate: {
      validator: function (v: string | null): boolean {
        // Valide si le champ est absent ou correspond au format
        return !v || /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} n'est pas un numéro de téléphone valide.`,
    },
  },
  role: { type: String, enum: ['EMPLOYEE', 'MANAGER', 'ADMIN'], default: 'EMPLOYEE' },
  service: {
    type: String,
    enum: ['Technique', 'Commercial', 'Administration'], // Limite les valeurs possibles
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Exporter le modèle User
const User = mongoose.model<IUser>('User', userSchema);
export default User;
