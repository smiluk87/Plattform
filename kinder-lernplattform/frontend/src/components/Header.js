import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Entferne den Token
    window.location.href = '/login'; // Weiterleitung zur Login-Seite
  };

  return (
    <header>
      <h1>Willkommen auf der Lernplattform!</h1>
      <nav>
        <Link to="/">Startseite</Link> |{' '}
        <Link to="/register">Registrieren</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/test">Testseite</Link> |{' '}
        <Link to="/quiz">Quiz</Link> |{' '}
        <Link to="/profile">Profil</Link> |{' '}
        <Link to="/progress">Fortschritt</Link> |{' '}
        <Link to="/leaderboard">Rangliste</Link> |{' '}
        {localStorage.getItem('token') && (
          <>
            <Link to="/dashboard">Dashboard</Link> |{' '} {/* Neuer Link zum Dashboard */}
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
