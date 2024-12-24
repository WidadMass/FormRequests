import axios from 'axios';

// Configuration de l'instance Axios
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de ton backend
  timeout: 5000, // Timeout de 5 secondes
});

// Ajouter un interceptor pour inclure le token JWT dans les requêtes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupère le token JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
