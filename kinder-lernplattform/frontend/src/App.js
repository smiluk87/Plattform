import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import TestPage from './pages/TestPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Willkommen auf der Lernplattform!</h1>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
