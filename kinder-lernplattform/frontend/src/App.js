import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage'; 
import QuizPage from './pages/QuizPage'; // Importiere die QuizPage-Komponente
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage'; // Importiere die Fortschrittsseite


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/quiz" element={<QuizPage />} /> {/* Route für Quiz */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/progress" element={<ProgressPage />} /> {/* Fortschrittsseite */}
      </Routes>
    </Router>
  );
};

export default App;

