import React, { useState, useEffect } from 'react';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');

  // Fragen aus der API laden
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/users/quiz/math', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Fehler beim Abrufen der Fragen');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Quizfragen:', error);
        setMessage('Fehler beim Laden der Quizfragen.');
      }
    };

    fetchQuestions();
  }, []);

  // Antwort verarbeiten
  const handleSubmitAnswer = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      setMessage(`Quiz beendet! Dein Punktestand: ${score + 1}`);
      saveProgress(score + 1);
    }
  };

  // Fortschritt speichern
  const saveProgress = async (finalScore) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/users/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: 'math', score: finalScore }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        if (data.reward) {
          alert(`Belohnung: ${data.reward}`);
        }
      } else {
        console.error('Fehler beim Speichern des Fortschritts');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Fortschritts:', error);
    }
  };

  if (questions.length === 0) {
    return <p>{message || 'Lade Fragen...'}</p>;
  }

  return (
    <div>
      <h1>Quiz</h1>
      <h2>{questions[currentQuestionIndex].question}</h2>
      {questions[currentQuestionIndex].options.map((option, index) => (
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
    </div>
  );
};

export default QuizPage;
