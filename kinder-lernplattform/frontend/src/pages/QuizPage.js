import React, { useState, useEffect } from 'react';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/users/quiz/math', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const handleSubmit = () => {
    if (questions[currentQuestion].answer === selectedOption) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setMessage(`Quiz beendet! Dein Score: ${score + 1}`);
    }
  };

  return (
    <div>
      <h1>Quiz</h1>
      {questions.length > 0 && currentQuestion < questions.length ? (
        <div>
          <h2>{questions[currentQuestion].question}</h2>
          {questions[currentQuestion].options.map((option, index) => (
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
          <button onClick={handleSubmit}>Antwort abschicken</button>
        </div>
      ) : (
        <p>{message || "Quiz wird geladen..."}</p>
      )}
    </div>
  );
};

export default QuizPage;
