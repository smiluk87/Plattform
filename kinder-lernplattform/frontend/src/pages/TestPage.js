import React, { useState } from 'react';

const TestPage = () => {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Header für JSON-Daten
        },
        body: JSON.stringify({
          email: 'tada12345@gmail.com', // Testwerte (später ersetzen)
          password: 'password12345', // Testwerte (später ersetzen)
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token); // Token im State speichern
        localStorage.setItem('token', data.token); // Token in localStorage speichern
      } else {
        console.error('Login fehlgeschlagen:', await res.text());
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
    }
  };
  
  const handleDashboard = async () => {
    const token = localStorage.getItem('token'); // Token aus localStorage holen
    if (!token) {
      setResponse('Kein Token vorhanden. Bitte zuerst einloggen.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/users/dashboard', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Token im Header senden
        },
      });
      const data = await res.json();
      setResponse(data.message); // Begrüßungsnachricht anzeigen
    } catch (error) {
      setResponse('Fehler beim Zugriff auf das Dashboard.');
      console.error('Fehler beim Zugriff auf das Dashboard:', error);
    }
  };

  return (
    <div>
      <h1>Testseite</h1>
      <button onClick={handleLogin}>Login</button>
      <p>Token: {token}</p>
      <button onClick={handleDashboard}>Dashboard</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default TestPage;
