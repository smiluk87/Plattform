import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Chart.js-Module registrieren
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [username, setUsername] = useState(''); // Benutzername speichern
  const [progress, setProgress] = useState([]); // Fortschrittsdaten speichern
  const [error, setError] = useState(''); // Fehlernachricht speichern
  const navigate = useNavigate(); // React-Router-Hook für Navigation

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken'); // Token aus LocalStorage holen

      if (!token) {
        setError('Kein Token gefunden. Bitte melden Sie sich an.');
        return;
      }

      try {
        // Benutzername abrufen
        const userRes = await fetch('http://localhost:5000/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) {
          throw new Error('Fehler beim Abrufen der Benutzer-Daten.');
        }

        const userData = await userRes.json();
        setUsername(userData.username); // Benutzername setzen

        // Fortschrittsdaten abrufen
        const progressRes = await fetch('http://localhost:5000/users/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!progressRes.ok) {
          // Wenn keine Fortschrittsdaten vorhanden sind, leeres Array setzen
          if (progressRes.status === 404) {
            setProgress([]);
          } else {
            throw new Error('Fehler beim Abrufen der Fortschritts-Daten.');
          }
        } else {
          const progressData = await progressRes.json();
          setProgress(progressData.progresses || []); // Fortschrittsdaten setzen oder leeres Array
        }
      } catch (err) {
        setError(err.message); // Fehler setzen
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Token entfernen
    navigate('/login'); // Zur Login-Seite weiterleiten
  };

  // Daten für das Diagramm vorbereiten
  const categories = progress.map((entry) => entry.category); // Kategorien (z. B. "Mathe")
  const scores = progress.map((entry) => entry.score); // Punkte pro Kategorie

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Punkte',
        data: scores,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Balkenfarbe
        borderColor: 'rgba(75, 192, 192, 1)', // Rahmenfarbe
        borderWidth: 1, // Rahmenbreite
      },
    ],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Willkommen auf dem Dashboard, {username}!</p> {/* Begrüßung unabhängig von Fehlern */}
      <button
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ff4d4f',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Logout
      </button>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p> // Fehler anzeigen
      ) : progress.length > 0 ? (
        <>
          <h2>Ihr Fortschritt</h2>
          <Bar
            data={chartData}
            options={{
              responsive: true, // Responsive Design
              plugins: {
                legend: {
                  position: 'top', // Position der Legende
                },
                title: {
                  display: true,
                  text: 'Fortschrittsübersicht', // Titel des Diagramms
                },
              },
              scales: {
                y: {
                  beginAtZero: true, // Y-Achse beginnt bei 0
                  title: {
                    display: true,
                    text: 'Punkte', // Beschriftung der Y-Achse
                  },
                },
              },
            }}
          />
        </>
      ) : (
        <p>Bisher keine Fortschrittsdaten vorhanden. Starten Sie ein Quiz, um Fortschritte zu machen!</p> // Nachricht bei fehlenden Fortschrittsdaten
      )}
    </div>
  );
};

export default DashboardPage;
