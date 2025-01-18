import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import für Navigation
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // React-Router-Hook für Navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Standard-Formularverhalten verhindern
    try {
      const res = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem('authToken', token); // Token speichern
        setMessage('Login erfolgreich!');
        navigate('/dashboard'); // Weiterleitung zum Dashboard nach erfolgreichem Login
      } else {
        setMessage('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Fehler beim Login.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>} {/* Zeigt die Nachricht an */}
    </div>
  );
};

export default LoginPage;
