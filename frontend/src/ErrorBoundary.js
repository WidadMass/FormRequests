// src/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Loguer l'erreur dans la console ou envoyer à un service externe
    console.log("Erreur capturée:", error);
    console.log("Infos sur l'erreur:", errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Affiche un message d'erreur personnalisé
      return (
        <div>
          <h1>Quelque chose s'est mal passé.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
          <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
