import React, { useState, useEffect, useCallback } from 'react';
import UserStatistics from '../components/UserStatistics';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Funktion zum Abrufen der Rangliste mit Paginierung
  const fetchLeaderboard = useCallback(async () => {
    const token = localStorage.getItem('authToken'); // Authentifizierungs-Token abrufen
    try {
      const res = await fetch(
        `http://localhost:5000/users/leaderboard?page=${page}&limit=6&category=${category}`, // API-Anfrage mit Paginierung und Kategorie
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error('Fehler beim Abrufen der Rangliste.');
      }

      const data = await res.json();
      setLeaderboard(data.leaderboard || []); // Ranglisten-Daten setzen
      setTotalPages(data.totalPages || 1); // Gesamtseitenanzahl setzen
    } catch (err) {
      setError(err.message); // Fehler im State speichern
    }
  }, [category, page]);

  useEffect(() => {
    fetchLeaderboard(); // Ranglisten-Daten bei Änderungen abrufen
  }, [fetchLeaderboard]);

  // Benutzerstatistiken öffnen
  const openUserStatistics = (userId) => setSelectedUser(userId);

  // Benutzerstatistiken schließen
  const closeUserStatistics = () => setSelectedUser(null);

  // Seiten-Navigation
  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
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
            setPage(1); // Bei Kategorienwechsel zur ersten Seite springen
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
                style={{
                  backgroundColor:
                    user.badge === 'Gold'
                      ? '#FFD700'
                      : user.badge === 'Silber'
                      ? '#C0C0C0'
                      : user.badge === 'Bronze'
                      ? '#CD7F32'
                      : 'transparent',
                }}
              >
                <td>{user.rank}</td>
                <td>
                  {/* Benutzername anklickbar machen */}
                  <span
                    style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}}
                    onClick={() => openUserStatistics(user.userId)} // Benutzer-ID übergeben
                  >
                    {user.username}
                  </span>
                </td>
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
      {selectedUser && (
        <UserStatistics userId={selectedUser} onClose={closeUserStatistics} />
      )}
    </div>
  );
};

export default LeaderboardPage;
