import React from "react";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
  const navigate = useNavigate();
  const goToHotelHub = () => navigate("/hotel");
  const goToGuestHub = () => navigate("/guest");

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome</h1>
      <p>Select a hub to continue</p>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={goToHotelHub} aria-label="Go to Hotel Hub">
          Hotel Hub
        </button>
        <button onClick={goToGuestHub} aria-label="Go to Guest Hub">
          Guest Hub
        </button>
      </div>
    </div>
  );
}
