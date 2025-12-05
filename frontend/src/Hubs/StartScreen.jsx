import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StartScreen() {
  const [roomInput, setRoomInput] = useState("");
  const navigate = useNavigate();

  // allow only digits
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRoomInput(digits);
  };

  const handleGuestClick = () => {
    sessionStorage.setItem("selectedRoomNumber", roomInput.trim());
    navigate("/guest");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header style={{ borderBottom: "1px solid #ddd", padding: "1rem" }}>
        <h2 style={{ margin: 0 }}>Hotel Hub</h2>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
          
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Welcome</h1>
          <p style={{ marginBottom: "2rem", color: "#555" }}>Select a hub to continue</p>

          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            
            {/* Hotel Hub Card */}
            <div style={{ 
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                cursor: "pointer"
            }}>
              <Link to="/hotel" style={{ textDecoration: "none", color: "inherit" }}>
                <h3 style={{ marginBottom: "0.5rem" }}>Hotel Hub</h3>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
                  Manage floors, rooms & devices
                </p>
                <button style={{
                  width: "100%",
                  padding: "0.7rem",
                  backgroundColor: "#2c3e50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Access Hotel Hub →
                </button>
              </Link>
            </div>

            {/* Guest Hub Card */}
            <div style={{ 
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd"
            }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Guest Hub</h3>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
                Control your room devices
              </p>
              
              <input 
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter room number"
                value={roomInput}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "1rem"
                }}
              />

              <button 
                onClick={handleGuestClick}
                disabled={!roomInput.trim()}
                style={{
                  width: "100%",
                  padding: "0.7rem",
                  backgroundColor: roomInput.trim() ? "#2c3e50" : "#bbb",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: roomInput.trim() ? "pointer" : "not-allowed"
                }}
              >
                Access Guest Hub →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #ddd", padding: "1rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        Hotel Management System
      </footer>
    </div>
  );
}
