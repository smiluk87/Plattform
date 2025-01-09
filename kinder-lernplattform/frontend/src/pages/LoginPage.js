import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Token in localStorage speichern
      setMessage(`Erfolgreich angemeldet: ${token}`);
    } catch (error) {
        if (error.response && error.response.status === 401) {
          setMessage('Ungültige E-Mail oder Passwort.');
        } else {
          setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
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
