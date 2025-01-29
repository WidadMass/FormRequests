import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import userRoutes from './user/userRoutes';
import requestRoutes from './request/requestRoutes'; 
import fileRoutes from './file/fileRoutes'; 

const app: Application = express();

// Servir les fichiers depuis 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Middleware global
app.use(cors());

// Middleware pour analyser les données JSON
app.use(bodyParser.json());

// Middleware pour analyser les données x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routes utilisateur
app.use('/api/users', userRoutes);

// Routes pour les demandes
app.use('/api/requests', requestRoutes);

// Routes pour les fichiers
app.use('/api/files', fileRoutes);

export default app; // Export de l'application pour une utiliser ailleurs 
