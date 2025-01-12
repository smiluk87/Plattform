import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Fehler beim Abrufen des Profils');
        }

        const data = await res.json();
        setUserData({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error('Fehler beim Speichern des Profils');
      }

      const data = await res.json();
      setMessage(data.message);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Profil</h1>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form>
        <div>
          <label>Benutzername:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        {editMode ? (
          <button type="button" onClick={handleSave}>
            Speichern
          </button>
        ) : (
          <button type="button" onClick={() => setEditMode(true)}>
            Bearbeiten
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
