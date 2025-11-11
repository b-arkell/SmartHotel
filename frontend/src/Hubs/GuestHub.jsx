import { useEffect, useState } from "react";

export default function GuestHub() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

// TODO: Implement proper useEffect() for GuestHub
useEffect(() => {
  const mockRoom = {
    id: 201,
    name: "Room A",
    devices: [
      { id: 1, name: "Thermostat", status: "On", type: "Thermostat" },
      { id: 2, name: "Camera", status: "Active", type: "Camera" },
      { id: 3, name: "Light", status: "Off", type: "Camera" }
    ]
  };

  setRoom(mockRoom);
  setLoading(false); 
}, [])

if (loading) return <p>Loading room data...</p>;
if (!room) return <p>No room data available.</p>; // prevents crashes

return (
 <div style={{
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: "#f5f5f5",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h1 style={{
        textAlign: "center",
        fontSize: "2.5rem",
        fontWeight: "600",
        marginBottom: "2rem",
        color: "#2c3e50"
      }}>
        Welcome to {room.name}
      </h1>

      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "1.5rem",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#34495e" }}>Your Devices</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.devices.map(device => {
            const isOff = ["Off", "Muted", "Inactive"].includes(device.status);
            return (
              <li key={device.id} style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid #ddd",
                fontSize: "1.1rem",
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span><strong>{device.name}</strong> ({device.type})</span>
                <span style={{
                  color: isOff ? "#e74c3c" : "#27ae60",
                  fontWeight: "600"
                }}>
                  {device.status}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

}