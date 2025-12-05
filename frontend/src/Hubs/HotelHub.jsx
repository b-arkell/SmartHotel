// HotelHub.jsx
import React, { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";
import { Link } from "react-router-dom";

export default function HotelHub() {
  const [hotel, setHotel] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomDevices, setRoomDevices] = useState([]);
  const [loadingHotel, setLoadingHotel] = useState(true);

  const { fetchRoomDevices, loading: loadingDevices, error } = useRoomApi(selectedRoomId);

  useEffect(() => {
    const storedFloor = sessionStorage.getItem("selectedFloorId");
    const storedRoom = sessionStorage.getItem("selectedRoomId");

    if (storedFloor) setSelectedFloorId(parseInt(storedFloor));
    if (storedRoom) setSelectedRoomId(parseInt(storedRoom));
  }, []);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/hotel`);
        if (!res.ok) throw new Error("Failed to fetch hotel data");
        const data = await res.json();
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoadingHotel(false);
      }
    };

    loadHotel();
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;

    const loadDevices = async () => {
      const devices = await fetchRoomDevices();
      setRoomDevices(devices || []);
    };

    loadDevices();
  }, [selectedRoomId, fetchRoomDevices]);

  const selectedFloor = hotel?.floors.find(f => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(r => r.id === selectedRoomId);

  // ---- UI STYLES ----
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f7f9fc",
      padding: "2rem",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "#fff",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
    heading: {
      textAlign: "center",
      fontSize: "2.5rem",
      marginBottom: "1.5rem",
      fontWeight: 600,
    },
    button: {
      padding: "0.75rem 1.5rem",
      background: "#2c3e50",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.2s",
    },
    activeButton: {
      padding: "0.75rem 1.5rem",
      background: "#1abc9c",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "0.2s",
      fontWeight: 600,
    },
    roomButton: active => ({
      padding: "0.75rem",
      width: "100%",
      background: active ? "#3498db" : "#bdc3c7",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      margin: "5px 0",
      borderRadius: "4px",
    }),
    status: isOff => ({
      color: isOff ? "#e74c3c" : "#27ae60",
      fontWeight: 600,
    }),
    card: {
      marginTop: "2rem",
      background: "#fff",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
    backLink: {
      textDecoration: "none",
      fontSize: "1rem",
      color: "#555",
      display: "inline-block",
      marginBottom: "1rem",
    },
  };

  // ------- Loading UI -------
  if (loadingHotel) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", marginTop: "5rem" }}>Loading hotel data...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ textAlign: "center" }}>No hotel data found.</p>
          <Link to="/" style={styles.backLink}>⬅ Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <Link to="/" style={styles.backLink}>⬅ Back</Link>

        <h1 style={styles.heading}>{hotel.name} Hub</h1>

        {/* Floor selection */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {hotel.floors.map(floor => (
            <button
              key={floor.id}
              style={selectedFloorId === floor.id ? styles.activeButton : styles.button}
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoomId(null);
                setRoomDevices([]);
                sessionStorage.setItem("selectedFloorId", floor.id.toString());
              }}
            >
              {floor.name}
            </button>
          ))}
        </div>

        {/* Room selection */}
        {selectedFloor && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              Select Room on {selectedFloor.name}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))", gap: "10px" }}>
              {selectedFloor.rooms.map(room => (
                <button
                  key={room.id}
                  style={styles.roomButton(selectedRoomId === room.id)}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    sessionStorage.setItem("selectedRoomId", room.id.toString());
                  }}
                >
                  {room.name}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Devices */}
        {selectedRoom && (
          <div style={styles.card}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
              Devices in {selectedRoom.name}
            </h2>

            {loadingDevices && <p>Loading devices...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {!loadingDevices && !error && (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {roomDevices.map(device => {
                  const isOff = ["Off", "Muted", "Inactive"].includes(device.status);
                  return (
                    <li key={device.id} style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>
                        <strong>{device.name}</strong> ({device.type})
                      </span>

                      <span style={styles.status(isOff)}>
                        {device.status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
