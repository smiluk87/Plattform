import React, { useState, useEffect } from 'react';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [category, setCategory] = useState('math'); // Standardkategorie
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Für Ladezustand

  // API-Aufruf, um Fragen basierend auf der Kategorie zu laden
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('authToken');
      setLoading(true);
      setMessage(''); // Zurücksetzen von Nachrichten
      try {
        const res = await fetch(`http://localhost:5000/quiz/${category}`, {
          headers: { Authorization: `Bearer ${token}` },
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
        setQuestions(data);
        setScore(0); // Punktestand zurücksetzen
        setSelectedOption(''); // Auswahl zurücksetzen
        setCurrentQuestionIndex(0); // Index zurücksetzen
      } catch (err) {
        setMessage(err.message);
        setQuestions([]); // Zurücksetzen bei Fehler
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]); // Aktualisieren, wenn die Kategorie geändert wird

  // Antwort absenden und Fortschritt berechnen
  const handleSubmitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1); // Punktestand aktualisieren
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Zur nächsten Frage wechseln
      setSelectedOption(''); // Auswahl zurücksetzen
    } else {
      const finalScore = score + (selectedOption === currentQuestion.answer ? 1 : 0);
      setMessage(`Quiz abgeschlossen! Dein Punktestand: ${finalScore}`);
      await saveProgress(finalScore); // Fortschritt speichern
    }
  };

  // Fortschritt speichern
  const saveProgress = async (finalScore) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch('http://localhost:5000/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, score: finalScore }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Fortschritt gespeichert: ${data.message}`);
      }
    } catch (err) {
      console.error('Fehler beim Speichern des Fortschritts:', err);
    }
  };

  if (loading) {
    return <p>Lade Fragen...</p>;
  }

  if (questions.length === 0) {
    return <p>{message || 'Keine Fragen gefunden.'}</p>;
  }

  return (
    <div>
      <h1>Quiz</h1>
      <div>
        <label>Wähle eine Kategorie:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="math">Mathe</option>
          <option value="english">Englisch</option>
        </select>
      </div>
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
  );
};

export default QuizPage;
