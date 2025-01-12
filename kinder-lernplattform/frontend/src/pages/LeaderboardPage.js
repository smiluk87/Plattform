import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState(''); // Kategorie-Filter
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      try {
        const url = category
          ? `http://localhost:5000/users/leaderboard/${category}`
          : 'http://localhost:5000/users/leaderboard';
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Fehler beim Abrufen der Rangliste.');
        }

        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeaderboard();
  }, [category]); // Neu laden, wenn sich die Kategorie ändert

  return (
    <div>
      <h1>Rangliste</h1>
      {error && <p>{error}</p>}
      <div>
        <label htmlFor="category">Kategorie wählen:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Alle Kategorien</option>
          <option value="math">Mathe</option>
          <option value="english">Englisch</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Platz</th>
            <th>Benutzername</th>
            <th>Gesamtpunkte</th>
            <th>Belohnung</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user.userId}
              style={{
                backgroundColor:
                  user.reward === 'Gold'
                    ? '#FFD700'
                    : user.reward === 'Silber'
                    ? '#C0C0C0'
                    : user.reward === 'Bronze'
                    ? '#CD7F32'
                    : 'transparent',
              }}
            >
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.totalScore}</td>
              <td>{user.reward || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
