import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [username, setUsername] = useState(''); // Benutzername speichern
  const [progress, setProgress] = useState([]); // Fortschrittsdaten speichern
  const [error, setError] = useState(''); // Fehlernachricht speichern

  // useEffect zum Abrufen der Benutzerdaten und Fortschrittsdaten
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken'); // Token aus LocalStorage holen

      if (!token) {
        setError('Kein Token gefunden. Bitte melden Sie sich an.');
        return;
      }

      try {
        // Benutzername abrufen
        const userRes = await fetch('http://localhost:5000/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) {
          throw new Error('Fehler beim Abrufen der Benutzer-Daten.');
        }

        const userData = await userRes.json();
        setUsername(userData.username);

        // Fortschrittsdaten abrufen
        const progressRes = await fetch('http://localhost:5000/users/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!progressRes.ok) {
          throw new Error('Fehler beim Abrufen der Fortschritts-Daten.');
        }

        const progressData = await progressRes.json();
        setProgress(progressData.progresses); // Fortschrittsdaten setzen
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
        <>
          <p>Willkommen auf dem Dashboard, {username}!</p> {/* Benutzername anzeigen */}
          <h2>Ihr Fortschritt</h2>
          {progress.length > 0 ? (
            <ul>
              {progress.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.category}:</strong> {entry.score} Punkte
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Fortschrittsdaten verfügbar.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
