import React, { useEffect, useState } from 'react';
import './UserStatistics.css'; // CSS für Styling

const UserStatistics = ({ userId, onClose }) => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/users/${userId}/statistics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Fehler: ${res.status}`);
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
    return <div className="user-statistics-error">{error}</div>;
  }

  if (!statistics) {
    return <div className="user-statistics-loading">Laden...</div>;
  }

  return (
    <div className="user-statistics-popup">
      <button className="close-button" onClick={onClose}>
        Schließen
      </button>
      <h2>Statistiken für {statistics.username}</h2>
      <p><strong>Gesamtpunkte:</strong> {statistics.totalScores}</p>
      <p><strong>Durchschnittliche Punkte:</strong> {statistics.averageScore}</p>
      <h3>Kategorien:</h3>
      <ul>
        {Object.entries(statistics.categoryProgress).map(([category, score]) => (
          <li key={category}>
            <strong>{category}:</strong> {score}
          </li>
        ))}
      </ul>
      <p><strong>Versuche:</strong> {statistics.attempts}</p>
    </div>
  );
};

export default UserStatistics;
