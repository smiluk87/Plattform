import React, { useState, useEffect } from 'react';

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/users/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProgress(data);
      } catch (err) {
        setError('Fehler beim Abrufen der Fortschrittsdaten.');
      }
    };

    fetchProgress();
  }, []);

  return (
    <div>
      <h1>Fortschritt</h1>
      {error && <p>{error}</p>}
      {progress.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Kategorie</th>
              <th>Punkte</th>
              <th>Zeitstempel</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((entry, index) => (
              <tr key={index}>
                <td>{entry.category}</td>
                <td>{entry.score}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Keine Fortschrittsdaten vorhanden.</p>
      )}
    </div>
  );
};

export default ProgressPage;
