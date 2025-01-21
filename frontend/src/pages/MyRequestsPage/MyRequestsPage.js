import React, { useEffect, useState, useMemo } from 'react';
import './MyRequestsPage.css';

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Tri par `createdAt` ordre desc (plus récent en premier).
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // ÉTATS POUR LE FILTRAGE
  const [filterType, setFilterType] = useState('');   // ex.: "Congé", "Incident", etc.
  const [filterStatus, setFilterStatus] = useState(''); // ex.: "Pending", "Approved", "Rejected"

  // RÉCUPÉRATION DES REQUÊTES
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vous devez être connecté.');

        const response = await fetch('http://localhost:5000/api/requests/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des requêtes.');
        }

        const data = await response.json();

        // Génère un ID personnalisé pour chaque demande
        const requestsWithId = data.map((request, index) => ({
          ...request,
          customId: `${new Date(request.createdAt).getFullYear()}-${String(index + 1).padStart(4, '0')}`,
        }));

        setRequests(requestsWithId);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // FONCTION DE TRADUCTION DE STATUT
  const translateStatus = (status) => {
    const statusMap = {
      Pending: 'En cours',
      Approved: 'Accepté',
      Rejected: 'Rejeté',
    };
    return statusMap[status] || status;
  };

  // FILTRE : on applique d'abord les filtres (type, statut), puis le tri.
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1) Filtre sur le Type (si filterType est non vide)
      if (filterType && req.type !== filterType) {
        return false;
      }
      // 2) Filtre sur le Statut (si filterStatus est non vide)
      if (filterStatus && req.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [requests, filterType, filterStatus]);

  // TRI : sur la liste déjà filtrée
  const sortedRequests = useMemo(() => {
    const copy = [...filteredRequests];
    copy.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;

      // Tri par date, ex. createdAt
      if (sortField === 'createdAt') {
        return order * (new Date(a.createdAt) - new Date(b.createdAt));
      }
      // Sinon tri textuel (type, status, customId)
      return order * ((a[sortField] ?? '').localeCompare(b[sortField] ?? ''));
    });
    return copy;
  }, [filteredRequests, sortField, sortOrder]);

  // GESTION DU TRI
  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  // GESTION DETAILS
  const handleDetails = (request) => setSelectedRequest(request);
  const closeDetails = () => setSelectedRequest(null);

  return (
    <div className="my-requests-page">
      <h1>Mes Requêtes</h1>

      {/* GESTION DES ERREURS ET DU CHARGEMENT */}
      {error && <p className="error-message">{error}</p>}
      {isLoading && <p className="loading-message">Chargement...</p>}

      {/* BARRE DE FILTRE */}
      {!isLoading && !error && (
        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="filterType">Filtrer par Type :</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- Tous --</option>
              <option value="Congé">Congé</option>
              <option value="Note de Frais">Note de frais</option>
              <option value="Incident">Incident</option>
              <option value="Autre Demande">Autre demande</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filterStatus">Filtrer par Statut :</label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">-- Tous --</option>
              <option value="Pending">En cours</option>
              <option value="Approved">Accepté</option>
              <option value="Rejected">Rejeté</option>
            </select>
          </div>
        </div>
      )}

      {/* LISTE DES REQUÊTES / TABLE */}
      {!isLoading && !error && (
        <>
          {sortedRequests.length === 0 ? (
            <p className="no-requests-message">Aucune requête trouvée avec ces filtres.</p>
          ) : (
            <table className="my-requests-table" aria-label="Table des requêtes">
              <thead>
                <tr>
                  <th onClick={() => handleSort('customId')}>
                    ID
                  </th>
                  <th onClick={() => handleSort('type')}>
                    Type
                  </th>
                  <th onClick={() => handleSort('status')}>
                    Statut
                  </th>
                  <th onClick={() => handleSort('createdAt')}>
                    Date de création
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.customId}</td>
                    <td>{request.type}</td>
                    <td className={`status-${request.status.toLowerCase()}`}>
                      {translateStatus(request.status)}
                    </td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleDetails(request)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* MODALE DE DETAILS */}
      {selectedRequest && (
        <div
          className="my-requests-modal-overlay"
          onClick={closeDetails}
          onKeyDown={(e) => e.key === 'Escape' && closeDetails()}
          role="dialog"
          tabIndex="-1"
        >
          <div className="my-requests-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Détails de la demande</h2>
            <p>
              <strong>ID :</strong> {selectedRequest.customId}
            </p>
            <p>
              <strong>Type :</strong> {selectedRequest.type}
            </p>
            <p>
              <strong>Statut :</strong> {translateStatus(selectedRequest.status)}
            </p>
            <p>
              <strong>Date de création :</strong>{' '}
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </p>

            {/* Affichez les autres champs nécessaires (description, dates, etc.) */}
            {selectedRequest.files && selectedRequest.files.length > 0 && (
              <div>
                <strong>Pièces jointes :</strong>
                <ul>
                  {selectedRequest.files.map((file) => (
                    <li key={file._id}>
                      <a
                        href={`http://localhost:5000/uploads/${file.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.originalName || 'Fichier joint'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="my-requests-close-button"
              onClick={closeDetails}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
