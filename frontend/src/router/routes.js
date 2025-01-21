import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/LoginPage/LoginPage';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import NewRequestPage from '../pages/NewRequestPage/NewRequestPage';
import MyRequestsPage from '../pages/MyRequestsPage/MyRequestsPage';
import PendingRequestsPage from '../pages/PendingRequestsPage/PendingRequestsPage';
import UserListPage from '../pages/UserListPage/UserListPage';
import DocumentsPage from '../pages/DocumentsPage/DocumentsPage';


// Fonction pour vérifier si le token est valide
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // Vérifiez l'expiration si nécessaire (par exemple, avec JWT)
  // Exemple avec un JWT décodé
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // Vérifie l'expiration
  } catch {
    return false; // Token invalide
  }
};

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function RoutesComponent() {
  return (
    <Router>
      <Routes>
        {/* Route par défaut */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />}
        />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout currentPage="Dashboard">
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout currentPage="Mon Profil">
                <ProfilePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/new-requests"
          element={
            <PrivateRoute>
              <Layout currentPage="Nouvelle Requête">
                <NewRequestPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <PrivateRoute>
              <Layout currentPage="Mes Requêtes">
                <MyRequestsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pending-requests"
          element={
            <PrivateRoute>
              <Layout currentPage="Demandes à Valider">
                <PendingRequestsPage />
              </Layout>
            </PrivateRoute>
          }
        />
                <Route
          path="/user-list"
          element={
            <PrivateRoute>
              <Layout currentPage="La Liste des Utilisateurs">
                <UserListPage/>
              </Layout>
            </PrivateRoute>
          }
        />
  
                <Route
          path="/documentation"
          element={
            <PrivateRoute>
              <Layout currentPage="Mes documents">
                <DocumentsPage/>
              </Layout>
            </PrivateRoute>
          }
        />



        {/* Route par défaut pour 404 */}
        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
