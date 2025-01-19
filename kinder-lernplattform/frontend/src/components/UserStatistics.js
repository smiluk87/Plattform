import React, { useEffect, useState } from 'react';
import './UserStatistics.css'; // CSS für Styling

const UserStatistics = ({ userId, onClose }) => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Token-Key angepasst, um Konsistenz mit der Empfehlung zu wahren
        const res = await fetch(`http://localhost:5000/users/user/${userId}/statistics`, {
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
      <p>
        <strong>Gesamtpunkte:</strong> {statistics.totalScores}
      </p>
      <p>
        <strong>Durchschnittliche Punkte:</strong>{' '}
        {statistics.averageScore.toFixed(2)} {/* Durchschnittliche Punkte präzise formatieren */}
      </p>
      <h3>Kategorien:</h3>
      <ul>
        {statistics.categoryProgress.map((category, index) => (
          <li key={index}>
            <strong>{category.category}:</strong> {category.totalScore} Punkte in {category.attempts} Versuchen
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserStatistics;
