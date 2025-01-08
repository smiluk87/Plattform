import React, { useState } from 'react';

const TestPage = () => {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/users/login', {
      method: 'POST',
    });
    const data = await res.json();
    setToken(data.token);
  };

  const handleDashboard = async () => {
    const res = await fetch('http://localhost:5000/users/dashboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <p>Token: {token}</p>
      <button onClick={handleDashboard}>Dashboard</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default TestPage;
