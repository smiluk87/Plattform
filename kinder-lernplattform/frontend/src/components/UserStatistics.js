import React, { useEffect, useState } from 'react';

const UserStatistics = ({ userId, onClose }) => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      
      try {
        const token = localStorage.getItem('token');
        console.log("Gesendeter Token:", token); // Debugging
        const res = await fetch(`http://localhost:5000/users/${userId}/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Fehler: ${res.status}`);
        }

        const data = await res.json();
        console.log("Erhaltene Daten:", data); // Debuggin
        setStatistics(data);
      } catch (err) {
        console.error("Fehler beim Abrufen der Statistiken:", err.message);
        setError(err.message);
      }
    };

    // Aufruf der Fetch-Funktion
    if (userId) {
        fetchStatistics();
      }
  }, [userId]);

  if (error) {
    return <div className="user-statistics-error">{error}</div>;
  }

  if (!statistics) {
    return <div className="user-statistics-loading">Laden...</div>;
  }

  return (
    <div className="user-statistics-popup">
      <button onClick={onClose}>Schließen</button>
      <h2>Statistiken für {statistics.username}</h2>
      <p>Gesamtpunkte: {statistics.totalScores}</p>
      <p>Durchschnittliche Punkte: {statistics.averageScore}</p>
      <h3>Kategorien:</h3>
      <ul>
        {Object.entries(statistics.categoryProgress).map(([category, score]) => (
          <li key={category}>
            {category}: {score}
          </li>
        ))}
      </ul>
      <p>Versuche: {statistics.attempts}</p>
    </div>
  );
};

export default UserStatistics;
