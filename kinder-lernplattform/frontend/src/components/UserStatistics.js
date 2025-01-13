import React, { useEffect, useState } from 'react';

const UserStatistics = ({ userId, onClose }) => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:5000/users/${userId}/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Fehler beim Abrufen der Benutzerstatistiken.');
        }

        const data = await res.json();
        setStatistics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!statistics) {
    return <div>Laden...</div>;
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
