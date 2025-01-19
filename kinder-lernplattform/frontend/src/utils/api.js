const API_URL = "http://localhost:5000"; // Basis-URL für API-Endpunkte

// Benutzerprofil abrufen
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen des Profils.");
  return response.json();
};

// Benutzerprofil aktualisieren
export const updateUserProfile = async (profileData, token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error("Fehler beim Aktualisieren des Profils.");
  return response.json();
};

// Fortschritt abrufen
export const getUserProgress = async (token) => {
  const response = await fetch(`${API_URL}/users/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen des Fortschritts.");
  return response.json();
};

// Fortschritt speichern
export const saveProgress = async (progressData, token) => {
  const response = await fetch(`${API_URL}/users/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(progressData),
  });
  if (!response.ok) throw new Error("Fehler beim Speichern des Fortschritts.");
  return response.json();
};

// Rangliste abrufen
export const getLeaderboard = async (category, page, limit, search, token) => {
  const url = `${API_URL}/users/leaderboard${category ? `/${category}` : ""}?page=${page}&limit=${limit}&search=${search}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen der Rangliste.");
  return response.json();
};

// Quizfragen abrufen
export const getQuizQuestions = async (category, token) => {
  const response = await fetch(`${API_URL}/users/quiz/${category}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen der Quizfragen.");
  return response.json();
};

// Dashboard-Daten abrufen
export const fetchDashboardData = async (token) => {
  const response = await fetch(`${API_URL}/users/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen der Dashboard-Daten: ${response.statusText}`);
  }

  return await response.json();
};

// Profil abrufen (Alternative zu getUserProfile)
export const fetchProfile = async (token) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Abrufen des Profils: ${response.statusText}`);
  }

  return await response.json();
};
