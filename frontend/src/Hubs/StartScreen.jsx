import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StartScreen() {
  const [roomInput, setRoomInput] = useState("");
  const navigate = useNavigate();

  // keep only digits in the field
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRoomInput(digits);
  };

 const handleGuestClick = () => {
  // Store the entered number for later use (even if unused for now)
  sessionStorage.setItem("selectedRoomNumber", roomInput.trim());
  navigate("/guest");
};

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome</h1>
      <p>Select a hub to continue</p>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/hotel" aria-label="Go to Hotel Hub">
          <button>Hotel Hub</button>
        </Link>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={roomInput}
            onChange={handleChange}
            placeholder="Room number (optional)"
            aria-label="Room number"
            style={{ padding: "0.4rem" }}
          />

        <button
          onClick={handleGuestClick}
          disabled={!roomInput.trim()}
          style={{
          padding: "0.5rem 1rem",
          backgroundColor: roomInput.trim() ? "#2c3e50" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: roomInput.trim() ? "pointer" : "not-allowed"
          }}
          > Guest Hub </button>
        </div>
      </div>
    </div>
  );
}
