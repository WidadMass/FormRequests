import React, { useState } from 'react';
import './LoginPage.css'; // Assurez-vous que le fichier CSS est correctement lié
import { useNavigate } from 'react-router-dom'; // Import pour rediriger
import axios from 'axios'; // Importer Axios

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // État pour gérer les messages d'erreur
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const navigate = useNavigate(); // Hook pour naviguer

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Réinitialise les messages d'erreur

    try {
      // Appel à l'API backend pour la connexion
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      console.log('Réponse backend :', response.data);

      // Stocke le token dans le stockage local
      localStorage.setItem('token', response.data.token);

      localStorage.setItem('role', response.data.user.role); // Stocker le rôle utilisateur
      // Redirige vers le tableau de bord
      navigate('/dashboard');
    } catch (error) {
      // Gestion des erreurs
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Message d'erreur du backend
      } else {
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo Help Air (en haut à gauche) */}
        <img src="/logo500.png" alt="Logo Help Air" className="logo-helpair" />

        {/* Logo Help Net (au-dessus du formulaire) */}
        <img src="/helpNet500logo.png" alt="Logo Help Net" className="logo-helpnet" />

        {/* Titre de la page */}
        <h2 className="login-title">Connexion</h2>

        {/* Formulaire de connexion */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
