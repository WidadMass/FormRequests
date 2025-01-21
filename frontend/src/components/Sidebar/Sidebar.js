import React, { useEffect, useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Remplacez par votre méthode pour obtenir le rôle
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Nettoyer les données de session
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <a href="/profile">Mon Profil</a>
        {/* Liens spécifiques pour les employés */}
        {role === 'EMPLOYEE' && (
          <>
            <a href="/new-requests">Nouvelle Demande</a>
            <a href="/my-requests">Mes Demandes</a>
            <a href="/documentation">Mes documents</a>
          </>
        )}
        {/* Liens spécifiques pour les managers */}
        {role === 'MANAGER' && (
          <>
            <a href="/new-requests">Nouvelle Demande</a>
            <a href="/my-requests">Mes Demandes</a>
            <a href="/pending-requests">Demandes à Valider</a>
            <a href="/documentation">Mes documents</a>
          </>
        )}
        {/* Liens spécifiques pour les administrateurs */}
        {role === 'ADMIN' && (
          <>
            <a href="/pending-requests">Demandes à Valider</a>
            <a href="/user-list">Gestion des Utilisateurs</a>
            <a href="/documentation">Mes documents</a>
          </>
        )}
        <a href="#logout" onClick={handleLogout}>Déconnexion</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
