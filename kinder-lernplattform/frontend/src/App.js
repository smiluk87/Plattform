import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage'; 
import QuizPage from './pages/QuizPage'; // Importiere die QuizPage-Komponente
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage'; // Importiere die Fortschrittsseite
import LeaderboardPage from './pages/LeaderboardPage'; // Importiere die Seite
import DashboardPage from './pages/DashboardPage'; // Importiere die Dashboard-Seite
import Logout from "./pages/Logout";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/quiz" element={<QuizPage />} /> {/* Route für Quiz */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/progress" element={<ProgressPage />} /> {/* Fortschrittsseite */}
        <Route path="/leaderboard" element={<LeaderboardPage />} /> {/* Leaderboardseite */}
        <Route path="/dashboard" element={<DashboardPage />} /> {/* Dashboard-Route hinzugefügt */}
        <Route path="/logout" element={<Logout />} /> {/* Dashboard-Route hinzugefügt */}
      </Routes>
    </Router>
  );
};

export default App;
