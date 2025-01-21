import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant ou invalide.');

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setPhone(response.data.phone || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSavePhone = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant ou invalide.');

      const response = await axios.put(
        `http://localhost:5000/api/users/${profile._id}`,
        { phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data);
      setIsEditingPhone(false);
      setSuccess('Téléphone mis à jour avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du téléphone.');
    }
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant ou invalide.');

      if (!currentPassword || !newPassword) {
        setError('Les deux champs de mot de passe sont requis.');
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/users/${profile._id}/password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentPassword('');
      setNewPassword('');
      setIsEditingPassword(false);
      setSuccess('Mot de passe modifié avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
    }
  };

  const handleCancelEditPhone = () => {
    setIsEditingPhone(false);
    setPhone(profile.phone || '');
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>

      {/* Messages d'erreur et de succès */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Indicateur de chargement */}
      {isLoading && <p>Chargement...</p>}

      {/* Contenu du profil */}
      {!isLoading && !error && profile && (
        <div className="profile-details">
          <div className="profile-row">
            <p>
              <strong>Prénom :</strong> {profile.firstName}
            </p>
            <p>
              <strong>Nom :</strong> {profile.lastName}
            </p>
            <p>
              <strong>Rôle :</strong> {profile.role}
            </p>
          </div>
          <div className="profile-email">
            <p>
              <strong>Email :</strong> {profile.email}
            </p>
          </div>
          <div className="phone-password-section">
            <div className="phone-edit">
              <strong>Téléphone :</strong>
              {isEditingPhone ? (
                <div className="edit-section">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ajouter/modifier le téléphone"
                  />
                  <button className="save-button" onClick={handleSavePhone}>
                    Enregistrer
                  </button>
                  <button className="cancel-button" onClick={handleCancelEditPhone}>
                    Annuler
                  </button>
                </div>
              ) : (
                <span>
                  {phone || 'Non renseigné'}
                  <button className="edit-button" onClick={() => setIsEditingPhone(true)}>
                    Modifier
                  </button>
                </span>
              )}
            </div>
            <div className="password-edit">
              <strong>Changer le mot de passe :</strong>
              {isEditingPassword ? (
                <div className="edit-section">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mot de passe actuel"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                  <button className="save-button" onClick={handleChangePassword}>
                    Enregistrer
                  </button>
                  <button className="cancel-button" onClick={handleCancelEditPassword}>
                    Annuler
                  </button>
                </div>
              ) : (
                <button className="edit-button" onClick={() => setIsEditingPassword(true)}>
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
