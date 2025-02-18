import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ChartJS-Module registrieren
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]); // Fortschrittsdaten
  const [statistics, setStatistics] = useState({}); // Statistiken
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(''); // Fehlernachricht

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('authToken');
      console.log("📡 Abruf des Fortschritts mit Token:", token);

      if (!token) {
        setError("Kein Authentifizierungs-Token gefunden.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/users/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔎 Status Code:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Fehler beim Abrufen der Fortschrittsdaten:", errorData);
          throw new Error(errorData.message || 'Fehler beim Abrufen der Fortschrittsdaten.');
        }

        const data = await res.json();
        console.log("✅ Erhaltene Fortschrittsdaten:", data);

        if (Array.isArray(data) && data.length > 0) {
          setProgressData(data);
          setStatistics({
            averageScore: (data.reduce((acc, entry) => acc + entry.score, 0) / data.length).toFixed(2),
            highestScore: Math.max(...data.map(entry => entry.score)),
            attempts: data.length,
          });
        } else {
          console.warn("⚠️ Keine Fortschrittsdaten vorhanden.");
          setProgressData([]);
          setStatistics({});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Kategorien und Scores für das Diagramm vorbereiten
  const categories = progressData.map((entry) => entry.category);
  const scores = progressData.map((entry) => entry.score);

  // Daten für das Balkendiagramm
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Punkte',
        data: scores,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Fortschritt</h1>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {loading && <p>⏳ Lade Fortschrittsdaten...</p>}

      {!loading && !error && progressData.length === 0 && (
        <p>⚠️ Keine Fortschrittsdaten vorhanden.</p>
      )}

      {!loading && progressData.length > 0 && (
        <>
          <div>
            <h3>📊 Statistiken:</h3>
            <p><strong>Durchschnittlicher Score:</strong> {statistics.averageScore || 'N/A'}</p>
            <p><strong>Höchster Score:</strong> {statistics.highestScore || 'N/A'}</p>
            <p><strong>Anzahl der Versuche:</strong> {statistics.attempts || 'N/A'}</p>
          </div>

          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Punkte',
                  },
                },
              },
            }}
          />

          <table>
            <thead>
              <tr>
                <th>Kategorie</th>
                <th>Punkte</th>
                <th>Zeitstempel</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.category}</td>
                  <td>{entry.score}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
