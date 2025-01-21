import React from 'react';
import './IconButton.css';

function IconButton({ icon: Icon, tooltip, onClick }) {
  return (
    <div className="icon-button-with-tooltip">
      <button className="icon-button" onClick={onClick}>
        {/* On affiche l'icône reçue en props */}
        <Icon />
      </button>
      {/* Tooltip personnalisé, affiche le texte passé en props */}
      <span className="custom-tooltip">{tooltip}</span>
    </div>
  );
}

export default IconButton;
