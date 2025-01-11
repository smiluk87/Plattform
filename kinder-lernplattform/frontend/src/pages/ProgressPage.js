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

// Registriere die Module in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [statistics, setStatistics] = useState({}); // Statistiken speichern
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/users/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProgress(data.progress);
        setStatistics(data.statistics); // Statistiken vom Backend übernehmen
      } catch (err) {
        setError('Fehler beim Abrufen der Fortschrittsdaten.');
      }
    };

    fetchProgress();
  }, []);

  // Daten für das Diagramm vorbereiten
  const categories = progress.map((entry) => entry.category);
  const scores = progress.map((entry) => entry.score);

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
      {error && <p>{error}</p>}
      <div>
        <h3>Statistiken:</h3>
        <p><strong>Durchschnittlicher Score:</strong> {statistics.averageScore}</p>
        <p><strong>Höchster Score:</strong> {statistics.highestScore}</p>
        <p><strong>Anzahl der Versuche:</strong> {statistics.attempts}</p>
      </div>
      {progress.length > 0 ? (
        <>
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
              {progress.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.category}</td>
                  <td>{entry.score}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Keine Fortschrittsdaten vorhanden.</p>
      )}
    </div>
  );
};

export default ProgressPage;