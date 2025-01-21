import React from 'react';
import './DocumentsPage.css';

const documents = [
  {
    title: 'Modèle de Note de Frais',
    description: 'Téléchargez le modèle officiel pour soumettre vos notes de frais.',
    link: '/static/docs/NOTE DE FRAIS VIERGE.xlsx',
  },
  {
    title: 'Guide de Procédures',
    description: 'Consultez le guide complet des procédures internes.',
    link: '/static/docs/guide-de-procedures.pdf',
  },
  {
    title: 'Formulaire de Congé',
    description: 'Remplissez le formulaire pour soumettre une demande de congé.',
    link: '/static/docs/formulaire-conge.pdf',
  },
];

const MesDocumentsPage = () => {
  return (
    <div className="mes-documents-page">
      <h1>Mes Documents</h1>
      <div className="documents-grid">
        {documents.map((doc, index) => (
          <div className="document-card" key={index}>
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
            <a href={doc.link} target="_blank" rel="noopener noreferrer" className="download-button">
              Télécharger
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesDocumentsPage;
