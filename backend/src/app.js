const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./user/userRoutes');
const requestRoutes = require('./request/requestRoutes'); // Importer les routes pour les demandes
const verifyRole = require('./middlewares/verifyRole');
const app = express();

// Middleware global
app.use(cors());

// Middleware pour analyser les données JSON
app.use(bodyParser.json());

// Middleware pour analyser les données x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Ajouter les routes utilisateur
app.use('/api/users', userRoutes);

// Ajouter les routes pour les demandes
app.use('/api/requests', requestRoutes);

module.exports = app;
