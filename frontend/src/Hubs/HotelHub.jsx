import { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";

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
    if (storedFloor && storedRoom) {
      setSelectedFloorId(parseInt(storedFloor));
      setSelectedRoomId(parseInt(storedRoom));
    }
  }, []);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/hotel`);
        if (!res.ok) throw new Error("Failed to fetch hotel data");
        const data = await res.json();
        setHotel(data);
      } catch (err) {
        console.error(err);
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
      setRoomDevices(devices);
    };
    loadDevices();
  }, [selectedRoomId, fetchRoomDevices]);

  const selectedFloor = hotel?.floors.find(f => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(r => r.id === selectedRoomId);

  if (loadingHotel) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading hotel data...</p>;
  }
  if (!hotel?.floors?.length) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No hotel data available.</p>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(6px)",
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>{hotel.name} Hub</h1>
      </header>

      <main style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        {/* Floor Selection */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Select Floor</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {hotel.floors.map(floor => (
              <button
                key={floor.id}
                onClick={() => {
                  setSelectedFloorId(floor.id);
                  setSelectedRoomId(null);
                  setRoomDevices([]);
                  sessionStorage.setItem("selectedFloorId", floor.id);
                }}
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: selectedFloorId === floor.id ? "#3498db" : "#ecf0f1",
                  color: selectedFloorId === floor.id ? "#fff" : "#2c3e50"
                }}
              >
                {floor.name}
              </button>
            ))}
          </div>
        </section>

        {/* Room Selection */}
        {selectedFloor && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Select Room</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "1rem"
            }}>
              {selectedFloor.rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    sessionStorage.setItem("selectedRoomId", room.id);
                  }}
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    borderRadius: "6px",
                    border: selectedRoomId === room.id ? "2px solid #3498db" : "1px solid #ddd",
                    cursor: "pointer",
                    backgroundColor: selectedRoomId === room.id ? "#d6eaf8" : "#fff"
                  }}
                >
                  {room.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Room Devices */}
        {selectedRoom && (
          <section>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
              Devices in {selectedRoom.name}
            </h2>
            <div style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {loadingDevices && <p>Loading devices...</p>}
              {error && <p style={{ color: "red" }}>Error: {error}</p>}
              {!loadingDevices && !error && roomDevices.length === 0 && <p>No devices found.</p>}
              <ul style={{ listStyle: "none", padding: 0 }}>
                {roomDevices.map(device => {
                  const offStates = ["Off", "Muted", "Inactive"];
                  const isOff = offStates.includes(device.status || "");
                  return (
                    <li key={device.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #eee"
                    }}>
                      <div>
                        <strong>{device.name}</strong> ({device.type})
                      </div>
                      {device.isOn !== undefined && (
                        <span style={{ color: device.isOn ? "#27ae60" : "#e74c3c" }}>
                          {device.isOn ? "On 💡" : "Off 🔌"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
