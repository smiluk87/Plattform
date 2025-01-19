import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Für Navigation

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [category, setCategory] = useState('math'); // Standardkategorie
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Für Ladezustand
  const [error, setError] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const navigate = useNavigate(); // Navigation-Handler

  // API-Aufruf, um Fragen basierend auf der Kategorie zu laden
  const fetchQuestions = async (subject) => {
    const token = localStorage.getItem('authToken');
    console.log('Token für Quiz-Anfrage:', token); // Debugging
    console.log('Kategorie für Quiz-Anfrage:', subject); // Debugging
    setLoading(true);
    setMessage(''); // Zurücksetzen von Nachrichten
    setError(''); // Zurücksetzen von Fehlern
    try {
      const res = await fetch(`http://localhost:5000/users/quiz/${subject}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 404) {
          setMessage('Keine Fragen in dieser Kategorie gefunden.');
        } else {
          throw new Error('Fehler beim Abrufen der Quizfragen.');
        }
        setQuestions([]); // Zurücksetzen bei Fehler
        return;
      }

      const data = await res.json();
      console.log('Quiz-Daten:', data); // Debugging
      setQuestions(data);
      setScore(0); // Punktestand zurücksetzen
      setSelectedOption(''); // Auswahl zurücksetzen
      setCurrentQuestionIndex(0); // Index zurücksetzen
      setIsFinished(false); // Reset bei erfolgreichem Abruf
    } catch (err) {
      console.error('Fehler beim Abrufen der Quizfragen:', err); // Debugging
      setError('Fehler beim Laden der Quizfragen.');
      setQuestions([]); // Zurücksetzen bei Fehler
    } finally {
      setLoading(false);
    }
  };

  // Lade die Fragen immer, wenn sich die Kategorie ändert
  useEffect(() => {
    fetchQuestions(category); // Laden der Fragen bei Änderung der Kategorie
  }, [category]);

  // Antwort absenden und Fortschritt berechnen
  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1); // Punktestand aktualisieren
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Zur nächsten Frage wechseln
      setSelectedOption(''); // Auswahl zurücksetzen
    } else {
      const finalScore = score + (selectedOption === currentQuestion.answer ? 1 : 0);
      setIsFinished(true); // Quiz abgeschlossen
      setMessage(`Quiz abgeschlossen! Dein Punktestand: ${finalScore}`);
      handleQuizSubmit(category, finalScore); // Funktion zum Speichern des Fortschritts aufrufen
    }
  };

  // Funktion zum Speichern des Fortschritts, die aufgerufen wird, wenn das Quiz abgeschlossen ist
  const handleQuizSubmit = (category, score) => {
    saveProgress(category, score); // Aufruf der saveProgress-Funktion
  };

  // Fortschritt speichern
  const saveProgress = async (category, score) => {
    const token = localStorage.getItem('authToken');
    console.log('Fortschritt speichern. Token:', token); // Debugging
    try {
      const res = await fetch('http://localhost:5000/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, score }),
      });

      if (!res.ok) {
        throw new Error('Fehler beim Speichern des Fortschritts');
      }

      const data = await res.json();
      console.log('Fortschritt erfolgreich gespeichert:', data); // Debugging
      alert(`Fortschritt gespeichert: ${data.message}`);
    } catch (err) {
      console.error('Fehler beim Speichern des Fortschritts:', err.message); // Debugging
    }
  };

  if (loading) {
    return <p>Lade Fragen...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (questions.length === 0) {
    return (
      <div>
        <p>{message || 'Keine Fragen gefunden.'}</p>
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
          Zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Quiz</h1>
      {!isFinished ? (
        <div>
          <h2>{questions[currentQuestionIndex]?.question}</h2>
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              {option}
            </div>
          ))}
          <button onClick={handleSubmitAnswer} disabled={!selectedOption}>
            Antwort abschicken
          </button>
          <p>Aktueller Punktestand: {score}</p>
        </div>
      ) : (
        <div>
          <h2>Quiz abgeschlossen!</h2>
          <p>Ihr Punktestand: {score} von {questions.length}</p>
          <button onClick={() => setIsFinished(false)}>Erneut versuchen</button>
        </div>
      )}

      <div>
        <label htmlFor="subject">Kategorie wählen:</label>
        <select
          id="subject"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="math">Mathe</option>
          <option value="english">Englisch</option>
        </select>
      </div>
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
        Zum Dashboard
      </button>
    </div>
  );
};

export default QuizPage;
