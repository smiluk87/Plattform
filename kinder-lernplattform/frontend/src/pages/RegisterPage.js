import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Für Erfolg- oder Fehlermeldungen

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/register', {
        username,
        email,
        password,
      });
      setMessage('Erfolgreich registriert!'); // Erfolgsmeldung anzeigen
      console.log('Erfolgreich registriert:', response.data);
    } catch (error) {
      setMessage('Fehler bei der Registrierung.'); // Fehlermeldung anzeigen
      console.error('Fehler bei der Registrierung:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Registrieren</h1>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="password"
            className="form-control"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          Registrieren
        </button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default RegisterPage;
