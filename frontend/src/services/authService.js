import API from './api';

// Fonction de connexion
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/users/login', { email, password });
    return response.data; // Retourne le token et les infos utilisateur
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur inconnue' };
  }
};

// Fonction de vérification utilisateur (optionnelle)
export const getUserProfile = async () => {
  try {
    const response = await API.get('/users/me'); // Endpoint pour récupérer les infos de l'utilisateur connecté
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Erreur inconnue' };
  }
};
