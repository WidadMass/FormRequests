import React, { useEffect, useState } from 'react';
import './UserListPage.css';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'EMPLOYEE',
    service: '',
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vous devez être connecté.');

        const response = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs.');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    (user.firstName || '').toLowerCase().includes(searchTerm) ||
    (user.lastName || '').toLowerCase().includes(searchTerm) ||
    (user.email || '').toLowerCase().includes(searchTerm) ||
    (user.service || '').toLowerCase().includes(searchTerm)
  );

  const handleToggleStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      const response = await fetch(`http://localhost:5000/api/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut.');
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser.user._id ? updatedUser.user : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.phone) delete payload.phone;
    if (editingUser && !formData.password) delete payload.password;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Vous devez être connecté.');

      const endpoint = editingUser
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : 'http://localhost:5000/api/users/register';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          editingUser
            ? "Erreur lors de la mise à jour de l'utilisateur."
            : "Erreur lors de la création de l'utilisateur."
        );
      }

      const newUser = await response.json();

      setUsers((prevUsers) =>
        editingUser
          ? prevUsers.map((user) => (user._id === newUser._id ? newUser : user))
          : [...prevUsers, newUser]
      );

      setFormData({ firstName: '', lastName: '', email: '', password: '', phone: '', role: 'EMPLOYEE', service: '' });
      setShowModal(false);
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      service: user.service || '',
      password: '',
    });
    setShowModal(true);
  };

  return (
    <div className="user-list-page">
      <h1>Gestion des Utilisateurs</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, email ou service"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <button onClick={() => setShowModal(true)} className="add-user-button">
        Ajouter un Utilisateur
      </button>

      {!isLoading && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Service</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.service || '—'}</td>
                <td>{user.phone || '—'}</td>
                <td className={user.isActive ? 'status-active' : 'status-inactive'}>
                  {user.isActive ? 'Actif' : 'Inactif'}
                </td>
                <td>
                  <button
                    className="toggle-status-button"
                    onClick={() => handleToggleStatus(user._id)}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleFormChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleFormChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleFormChange}
                disabled={!!editingUser}
                required={!editingUser}
              />
              <input
                type="text"
                name="phone"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={handleFormChange}
              />
              <select
                name="service"
                value={formData.service}
                onChange={handleFormChange}
                required
              >
                <option value="">-- Sélectionner un service --</option>
                <option value="Technique">Technique</option>
                <option value="Commercial">Commercial</option>
                <option value="Administration">Administration</option>
              </select>
              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="EMPLOYEE">Employé</option>
                <option value="MANAGER">Manager</option>
              </select>
              <button type="submit">{editingUser ? 'Modifier' : 'Ajouter'}</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
