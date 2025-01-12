import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/users/leaderboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        setError('Fehler beim Abrufen der Rangliste.');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Rangliste</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Platz</th>
            <th>Benutzer-ID</th>
            <th>Gesamtpunkte</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.userId}</td>
              <td>{user.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
