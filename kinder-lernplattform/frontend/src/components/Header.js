import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Prüfen, ob Token existiert

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Token entfernen
    navigate('/login'); // Zur Login-Seite weiterleiten
  };

  return (
    <header 
      style={{
        padding: '10px',
        backgroundColor: '#f4f4f4',
        borderBottom: '2px solid #ddd'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Willkommen auf der Lernplattform!</h1>
      
      <nav 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          padding: '10px',
          overflowX: 'auto' // Falls nicht genug Platz ist, kann man scrollen
        }}
      >
        <Link to="/">Startseite</Link>|{' '}
        <Link to="/register">Registrieren</Link>|{' '}
        <Link to="/login">Login</Link>|{' '}
        <Link to="/test">Testseite</Link>|{' '}
        <Link to="/quiz">Quiz</Link>|{' '}
        <Link to="/profile">Profil</Link>|{' '}
        <Link to="/progress">Fortschritt</Link>|{' '}
        <Link to="/leaderboard">Rangliste</Link>|{' '}

        {/* Dashboard & Logout-Button nur zeigen, wenn Token existiert */}
        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button 
              onClick={handleLogout} 
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

