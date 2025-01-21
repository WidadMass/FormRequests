import React, { useState } from 'react';
import './NewRequestPage.css';

const NewRequestPage = () => {
  // ÉTATS GÉNÉRAUX
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // CHAMPS SPÉCIFIQUES
  // -- Commun par exemple : service
  const [service, setService] = useState('');

  // -- Pour Congé
  const [natureConge, setNatureConge] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // -- Pour Note de Frais
  const [periodeFrais, setPeriodeFrais] = useState('');
  const [montantFrais, setMontantFrais] = useState('');

  // -- Pour Incident
  const [incidentDescription, setIncidentDescription] = useState('');

  // MESSAGES
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Petite validation locale : la date de fin doit être >= date de début
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      setErrorMessage('La date de fin doit être postérieure ou egale à la date de début.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      // Construction du FormData
      const formData = new FormData();
      formData.append('type', type);
      if (endDate) {
        formData.append('endDate', endDate);
      }

      // Champs communs (exemple : service)
      formData.append('service', service);

      // Champs spécifiques
      if (type === 'Congé') {
        formData.append('natureConge', natureConge);
        formData.append('description', description);
        formData.append('startDate', startDate);
      } else if (type === 'Note de Frais') {
        formData.append('periodeFrais', periodeFrais);
        formData.append('montantFrais', montantFrais);
      } else if (type === 'Incident') {
        formData.append('incidentDescription', incidentDescription);
      }
      // Autre Demande ? Ajoute d’autres champs si besoin

      // Gérer le fichier joint
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // Requête vers ton backend
      const response = await fetch('http://localhost:5000/api/requests/submit', {
        method: 'POST',
        headers: {
          // Pas de Content-Type ici, FormData gère tout
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Erreur lors de la création de la requête.'
        );
      }

      // Remise à zéro du formulaire
      setType('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setSelectedFile(null);
      setService('');
      setNatureConge('');
      setPeriodeFrais('');
      setMontantFrais('');
      setIncidentDescription('');

      setSuccessMessage('Requête créée avec succès !');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="new-request-page">
      <h1>Nouvelle Demande</h1>

      {/* Messages d'état */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Sélection du type de demande */}
        <div className="form-group">
          <label htmlFor="type">Type de demande :</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">-- Sélectionnez --</option>
            <option value="Congé">Congé</option>
            <option value="Note de Frais">Note de frais</option>
            <option value="Incident">Incident</option>
            <option value="Autre Demande">Autre demande</option>
          </select>
        </div>

        {/* Description globale (si tu en as besoin) */}
        <div className="form-group">
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre requête"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Champ commun "service" avec un select */}
        <div className="form-group">
          <label htmlFor="service">Service :</label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">-- Sélectionnez --</option>
            <option value="Technique">Technique</option>
            <option value="Commercial">Commercial</option>
            <option value="Administrateur">Administrateur</option>
          </select>
        </div>

        {/* SECTION SPÉCIFIQUE : Congé */}
        {type === 'Congé' && (
          <div className="form-group">
            <label htmlFor="natureConge">Nature du congé :</label>
            <select
              id="natureConge"
              value={natureConge}
              onChange={(e) => setNatureConge(e.target.value)}
            >
              <option value="">-- Sélectionnez --</option>
              <option value="Annuel">Annuel</option>
              <option value="Repos compensateur">Repos compensateur</option>
              <option value="Récupération">Récupération</option>
              <option value="Motif familial">Motif familial</option>
            </select>
            <label htmlFor="startDate">Date de début :</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <label htmlFor="endDate">Date de fin :</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}

        {/* SECTION SPÉCIFIQUE : Note de Frais */}
        {type === 'Note de Frais' && (
          <>
            <div className="form-group">
              <label htmlFor="periodeFrais">
                Période des frais (mois/année) :
              </label>
              <input
                type="text"
                id="periodeFrais"
                value={periodeFrais}
                onChange={(e) => setPeriodeFrais(e.target.value)}
                placeholder="Ex: 02/2025 ou février 2025"
              />
            </div>
            <div className="form-group">
              <label htmlFor="montantFrais">Montant total :</label>
              <input
                type="number"
                id="montantFrais"
                value={montantFrais}
                onChange={(e) => setMontantFrais(e.target.value)}
              />
            </div>
          </>
        )}

        {/* SECTION SPÉCIFIQUE : Incident */}
        {type === 'Incident' && (
          <><div className="form-group">
            <label htmlFor="incidentDescription">
              Description de l'incident :
            </label>
            <textarea
              id="incidentDescription"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              rows="3"
            />
          </div>
          </>
        )}

        {/* SECTION SPÉCIFIQUE : Autre Demande (si besoin) */}
        {type === 'Autre Demande' && (
          <div className="form-group">
            <label htmlFor="autreDemandeInfo">Détails :</label>
            <textarea
              id="autreDemandeInfo"
              rows="3"
              placeholder="Décrivez votre demande spécifique..."
            ></textarea>
            {/* tu peux ajouter un état pour stocker cette info si besoin */}
          </div>
        )}

        {/* Champ fichier (optionnel) */}
        <div className="form-group">
          <label htmlFor="file">Joindre un fichier (optionnel) :</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-button">
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;
