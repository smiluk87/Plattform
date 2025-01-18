import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken'); // Token aus dem LocalStorage abrufen
      if (!token) {
        setError('Authentifizierung fehlgeschlagen. Bitte melden Sie sich an.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Nicht autorisiert. Bitte melden Sie sich erneut an.');
          }
          throw new Error('Fehler beim Abrufen des Profils.');
        }

        const data = await res.json();
        setUserData({ username: data.username, email: data.email });
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('authToken'); // Token abrufen
    if (!token) {
      setError('Authentifizierung fehlgeschlagen. Bitte melden Sie sich an.');
      return;
    }

    setLoading(true);
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
        if (res.status === 401) {
          throw new Error('Nicht autorisiert. Bitte melden Sie sich erneut an.');
        }
        throw new Error('Fehler beim Speichern des Profils.');
      }

      const data = await res.json();
      setMessage(data.message); // Erfolgsnachricht anzeigen
      setError('');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h1>Profil</h1>
      {loading && <p>Laden...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Benutzername:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            disabled={!editMode || loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!editMode || loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
        {editMode ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading} // Button während des Ladens deaktivieren
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Bearbeiten
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
