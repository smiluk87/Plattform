import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [username, setUsername] = useState(''); // Benutzername speichern
  const [error, setError] = useState('');

  // useEffect zum Abrufen der Benutzerdaten vom Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken'); // Token aus LocalStorage holen

      if (!token) {
        setError('Kein Token gefunden. Bitte melden Sie sich an.');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Fehler beim Abrufen der Dashboard-Daten.');
        }

        const data = await res.json();
        setUsername(data.username); // Benutzername setzen
      } catch (err) {
        setError(err.message); // Fehler setzen
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p> // Fehler anzeigen
      ) : (
        <p>Willkommen auf dem Dashboard, {username}!</p> // Benutzername anzeigen
      )}
    </div>
  );
};

export default DashboardPage;
