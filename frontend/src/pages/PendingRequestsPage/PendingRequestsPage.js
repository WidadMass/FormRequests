import React, { useEffect, useState } from 'react';
import './PendingRequestsPage.css';

function PendingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vous devez être connecté.');

        const response = await fetch('http://localhost:5000/api/requests/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes en attente.');
        }

        const data = await response.json();

        // Générer un ID personnalisé pour chaque demande
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

    fetchPendingRequests();
  }, []);

  const handleDetails = (request) => {
    setSelectedRequest(request);
    setShowRejectReason(false);
    setRejectReason('');
  };

  const closeDetails = () => {
    setSelectedRequest(null);
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 'En cours';
      case 'Approved':
        return 'Accepté';
      case 'Rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      const response = await fetch(`http://localhost:5000/api/requests/approve/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'approbation de la demande.");
      }

      const updatedRequests = requests.map((req) =>
        req._id === selectedRequest._id ? { ...req, status: 'Approved' } : req
      );
      setRequests(updatedRequests);
      setSelectedRequest(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const showRejectField = () => {
    setShowRejectReason(true);
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectReason) {
      alert('Veuillez renseigner le motif de rejet.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      const response = await fetch(`http://localhost:5000/api/requests/reject/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du rejet de la demande.");
      }

      const updatedRequests = requests.map((req) =>
        req._id === selectedRequest._id ? { ...req, status: 'Rejected', reason: rejectReason } : req
      );
      setRequests(updatedRequests);
      setSelectedRequest(null);
      setShowRejectReason(false);
      setRejectReason('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="pending-requests-page">
      <h1>Demandes à Valider</h1>

      {error && <p className="error-message">{error}</p>}
      {isLoading && <p>Chargement...</p>}

      {!isLoading && !error && (
        <div className="requests-list">
          {requests.length === 0 ? (
            <p>Aucune demande en attente.</p>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Adresse e-mail</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.customId}</td>
                    <td>{req.userId?.lastName || '—'}</td>
                    <td>{req.userId?.firstName || '—'}</td>
                    <td>{req.userId?.email || '—'}</td>
                    <td>{req.type}</td>
                    <td className={`status-${req.status.toLowerCase()}`}>
                      {translateStatus(req.status)}
                    </td>
                    <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <button onClick={() => handleDetails(req)}>Détails</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedRequest && (
  <div className="pending-requests-modal">
    <div className="pending-requests-modal-content">
            <h2>Détails de la Demande</h2>
            <p><strong>ID :</strong> {selectedRequest.customId}</p>
            <p><strong>Nom :</strong> {selectedRequest.userId?.lastName || '—'}</p>
            <p><strong>Prénom :</strong> {selectedRequest.userId?.firstName || '—'}</p>
            <p><strong>Adresse e-mail :</strong> {selectedRequest.userId?.email || '—'}</p>
            <p><strong>Type :</strong> {selectedRequest.type}</p>
            <p><strong>Statut :</strong> {translateStatus(selectedRequest.status)}</p>
            <p><strong>Date de création :</strong> {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : '—'}</p>
            {selectedRequest.files && selectedRequest.files.length > 0 && (
              <div>
                <strong>Pièces Jointes :</strong>
                <ul>
                  {selectedRequest.files.map((file) => (
                    <li key={file._id}>
                      <a
                        href={`http://localhost:5000/uploads/${file.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.originalName || 'Voir le fichier'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedRequest.status === 'Pending' && (
              <>
                <button className="approve-button" onClick={handleApprove}>
                  Approuver
                </button>
                {!showRejectReason && (
                  <button className="reject-button" onClick={showRejectField}>
                    Rejeter
                  </button>
                )}
                {showRejectReason && (
                  <div className="reject-reason-form">
                    <textarea
                      placeholder="Motif du rejet"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button onClick={handleReject}>Confirmer Rejet</button>
                  </div>
                )}
              </>
            )}

            <button className="close-button" onClick={closeDetails}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingRequestsPage;
