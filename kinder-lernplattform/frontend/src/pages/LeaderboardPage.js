import React, { useState, useEffect, useCallback } from 'react';
import UserStatistics from '../components/UserStatistics';
import axios from 'axios';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    try {
      const url = `http://localhost:5000/leaderboard?category=${category}&page=${page}&limit=5&search=${search}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setLeaderboard(res.data.leaderboard || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Fehler beim Abrufen der Rangliste.');
    }
  }, [category, page, search]);
  

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const openUserStatistics = (userId) => {
    setSelectedUser(userId);
  };

  const closeUserStatistics = () => {
    setSelectedUser(null);
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
                key={user.userid}
                onClick={() => openUserStatistics(user.userid)}
                style={{
                  backgroundColor:
                    user.reward === 'Gold'
                      ? '#FFD700'
                      : user.reward === 'Silber'
                      ? '#C0C0C0'
                      : user.reward === 'Bronze'
                      ? '#CD7F32'
                      : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <td>{index + 1 + (page - 1) * 5}</td>
                <td>{user.User.username}</td>
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
      {selectedUser && (
        <UserStatistics userId={selectedUser} onClose={closeUserStatistics} />
      )}
    </div>
  );
};

export default LeaderboardPage;
