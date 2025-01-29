import dotenv from 'dotenv';
import app from './app'; // Charger Express
import connectDB from './config/db'; // Charger MongoDB

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB()
  .then(() => {
    // Démarrer le serveur uniquement après la connexion à la base de données
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error(`Erreur de connexion à MongoDB : ${error.message}`);
    process.exit(1); // Arrêter le processus si la base de données ne se connecte pas
  });
