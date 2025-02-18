import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("👋 Logout wird ausgeführt...");
    localStorage.removeItem("authToken");
    navigate("/login"); // Weiterleitung zur Login-Seite
  }, [navigate]);

  return (
    <div>
      <h1>Logout</h1>
      <p>Du wirst ausgeloggt...</p>
    </div>
  );
};

export default Logout;
