// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assurez-vous d'importer votre fichier App.js
import ErrorBoundary from './ErrorBoundary'; // Importez le fichier ErrorBoundary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
