import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Inclure le token
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Impossible de récupérer les informations du profil.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      {error && <p className="error-message">{error}</p>}
      {profile ? (
        <div className="profile-details">
          <p><strong>Prénom :</strong> {profile.firstName}</p>
          <p><strong>Nom :</strong> {profile.lastName}</p>
          <p><strong>Email :</strong> {profile.email}</p>
          <p><strong>Rôle :</strong> {profile.role}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default ProfilePage;
