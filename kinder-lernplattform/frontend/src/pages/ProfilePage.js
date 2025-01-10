import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setMessage(data.message);
    setEditMode(false);
  };

  return (
    <div>
      <h1>Profil</h1>
      {message && <p>{message}</p>}
      <div>
        <label>Benutzername:</label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          disabled={!editMode}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          disabled={!editMode}
        />
      </div>
      {editMode ? (
        <button onClick={handleUpdate}>Speichern</button>
      ) : (
        <button onClick={() => setEditMode(true)}>Bearbeiten</button>
      )}
    </div>
  );
};

export default ProfilePage;
