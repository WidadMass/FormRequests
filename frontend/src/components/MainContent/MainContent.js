// src/components/MainContent/MainContent.jsx

import React from 'react';
import './MainContent.css';

function MainContent({ children }) {
  return (
    <div className="main-content">
      {/* Le contenu passé depuis Layout ou une page s’affiche ici */}
      {children}
    </div>
  );
}

export default MainContent;
