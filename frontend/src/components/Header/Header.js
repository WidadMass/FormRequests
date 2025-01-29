import React from 'react';
import { FaEnvelope, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '../IconButton/IconButton';
import './Header.css'; // <-- On importe le fichier de style

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Map des chemins vers les titres de page
  const pageTitles = {
    '/dashboard': 'Accueil',
    '/profile': 'Mon Profil',
    '/my-requests': 'Mes Requêtes',
    '/pending-requests': 'Requêtes à Valider',
    '/documentation': 'Documentation',
    // ajoute d’autres chemins si besoin
  };

  // Récupérer le titre en fonction de la route
  const currentTitle = pageTitles[location.pathname] || 'Mon Intranet';

  // Gérer la déconnexion
  const handleLogout = () => {
    // Ex : Supprimer token, puis rediriger vers l'accueil
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Logo cliquable -> retour Dashboard */}
        <img
          src="/RequestFlow.png"
          alt="RequestFlow Logo"
          className="logo-RequestFlow"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        />
        {/* Titre de page dynamique */}
        <span className="page-title">{currentTitle}</span>
      </div>

      <div className="header-buttons">
        <IconButton
          icon={FaEnvelope}
          tooltip="Messagerie"
          onClick={() => navigate('/messagerie')}
        />
        <IconButton
          icon={FaBell}
          tooltip="Notifications"
          onClick={() => navigate('/notifications')}
        />
        <IconButton
          icon={FaUser}
          tooltip="Profil"
          onClick={() => navigate('/profile')}
        />
        <IconButton
          icon={FaSignOutAlt}
          tooltip="Déconnexion"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}

export default Header;
