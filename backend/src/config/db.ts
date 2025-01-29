import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    // On "force" le type string pour process.env.MONGO_URI 
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: 'RequestDB',
    });
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    // Ici, on cast `error` en `Error` pour récupérer `error.message`
    console.error('Erreur de connexion MongoDB :', (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
