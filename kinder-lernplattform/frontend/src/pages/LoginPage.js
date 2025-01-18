import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token); // Token speichern
        navigate('/dashboard'); // Weiterleitung nach erfolgreichem Login
      } else {
        throw new Error(data.message || 'Fehler beim Login.');
      }
    } catch (err) {
      setError(err.message); // Fehlernachricht setzen
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
