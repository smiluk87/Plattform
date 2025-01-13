import React, { useState, useEffect, useCallback } from 'react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  // Fetch-Funktion für die Rangliste
  const fetchLeaderboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const url = `http://localhost:5000/users/leaderboard${category ? `/${category}` : ''}?page=${page}&limit=5&search=${search}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Fehler beim Abrufen der Rangliste.');
      }

      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    }
  }, [category, page, search]);

  // Effect-Hook, um Daten zu laden, wenn Filter/Suche/Seite geändert werden
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

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
      <div>
        <label htmlFor="category">Kategorie wählen:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Alle Kategorien</option>
          <option value="math">Mathe</option>
          <option value="english">Englisch</option>
        </select>
      </div>
      <div>
        <label htmlFor="search">Benutzer suchen:</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Benutzername eingeben"
        />
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
          {leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
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
                <td>{index + 1 + (page - 1) * 5}</td>
                <td>{user.username}</td>
                <td>{user.totalScore}</td>
                <td>{user.reward || '—'}</td>
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
    </div>
  );
};

export default LeaderboardPage;
