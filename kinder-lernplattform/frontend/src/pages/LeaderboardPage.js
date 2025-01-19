import React, { useState, useEffect, useCallback } from 'react';
import UserStatistics from '../components/UserStatistics';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    const token = localStorage.getItem('authToken'); // Token abrufen
    try {
      const res = await fetch(
        `http://localhost:5000/users/leaderboard?category=${category}&page=${page}&limit=6`, // Anfrage mit Kategorie und Paginierung
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error('Fehler beim Abrufen der Rangliste.');
      }

      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setTotalPages(Math.ceil(data.totalCount / 6)); // Berechnung der Gesamtseiten basierend auf totalCount
    } catch (err) {
      setError(err.message);
    }
  }, [category, page]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const openUserStatistics = (userId) => setSelectedUser(userId);
  const closeUserStatistics = () => setSelectedUser(null);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <h1>Rangliste</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Kategorie-Auswahl */}
      <div>
        <label htmlFor="category">Kategorie wählen:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1); // Seite zurücksetzen, wenn Kategorie geändert wird
          }}
        >
          <option value="">Alle Kategorien</option>
          <option value="math">Mathe</option>
          <option value="english">Englisch</option>
        </select>
      </div>
      
      {/* Rangliste-Tabelle */}
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
          {leaderboard.length > 0 ? (
            leaderboard.map((user) => (
              <tr
                key={user.rank}
                onClick={() => openUserStatistics(user.userId)}
                style={{
                  backgroundColor:
                    user.badge === 'Gold'
                      ? '#FFD700'
                      : user.badge === 'Silber'
                      ? '#C0C0C0'
                      : user.badge === 'Bronze'
                      ? '#CD7F32'
                      : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <td>{user.rank}</td>
                <td>{user.username}</td>
                <td>{user.totalScore}</td>
                <td>{user.badge}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Keine weiteren Ergebnisse
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={handlePrevious} disabled={page === 1}>
          Vorherige
        </button>
        <span>
          Seite {page} von {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Nächste
        </button>
      </div>

      {/* Benutzerstatistiken anzeigen */}
      {selectedUser && <UserStatistics userId={selectedUser} onClose={closeUserStatistics} />}
    </div>
  );
};

export default LeaderboardPage;
