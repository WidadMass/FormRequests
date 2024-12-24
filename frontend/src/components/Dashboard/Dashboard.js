import React from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';


const Dashboard = () => {
  const location = useLocation();

  // Map des chemins vers les titres des pages
  const pageTitles = {
    '/': 'Accueil',
    '/profile': 'Mon Profil',
    '/my-requests': 'Mes Requêtes',
    '/pending-requests': 'Requêtes à Valider',
    '/user-list': 'Gestion des Utilisateurs',
    '/documentation': 'Documentation',
  };

  const currentPage = pageTitles[location.pathname] || 'Accueil'; // Titre par défaut

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="dashboard-page">
      {/* En-tête */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/helpNet500logo.png" alt="HelpNet Logo" className="logo-helpnet" />
          <span className="page-title">{currentPage}</span>
        </div>
        <div className="header-buttons">
          <button>Messagerie</button>
          <button>Notifications</button>
          <button>Profil</button>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      {/* Barre latérale */}
      <aside className="sidebar">
        <nav className="sidebar-menu">
          <a href="/profile">Mon Profil</a>
          <a href="/my-requests">Mes Requêtes</a>
          <a href="/pending-requests">Requêtes à Valider</a>
          <a href="/user-list">Gestion des Utilisateurs</a>
          <a href="/documentation">Documentation</a>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="main-content">
        <main className="dashboard-content">
          <section className="notification">
            <h2>Mise à jour</h2>
            <p>
              Bonjour, <br /> <br />
              À bientôt,
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
