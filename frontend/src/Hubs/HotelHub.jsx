import { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";

export default function HotelHub() {
  const [hotel, setHotel] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomDevices, setRoomDevices] = useState([]);
  const [loadingHotel, setLoadingHotel] = useState(true);

  const {
    fetchRoomDevices,
    loading: loadingDevices,
    error,
  } = useRoomApi(selectedRoomId);

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
      console.log("Fetched devices:", devices);
      setRoomDevices(devices);
    };

    loadDevices();
  }, [selectedRoomId, fetchRoomDevices]);

  // To match the floor obj to the selected + find room obj in selected floor
  const selectedFloor = hotel?.floors.find((f) => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(
    (r) => r.id === selectedRoomId
  );

  if (loadingHotel) return <p>Loading device...</p>;
  if (!hotel || !Array.isArray(hotel.floors) || hotel.floors.length === 0) {
    return <p>No hotel data available.</p>; // prevents crashes
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1
        style={{ textAlign: "center", fontSize: "3rem", marginBottom: "2rem" }}
      >
        {hotel.name} Hub
      </h1>

      {/* Floor Selection */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {hotel.floors.map((floor) => (
          <div key={floor.id}>
            <button
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoomId(null);
                setRoomDevices([]);
              }}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#2c3e50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {floor.name}
            </button>

            {selectedFloorId === floor.id && (
              <div style={{ marginTop: "0.5rem" }}>
                {floor.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.75rem 1.5rem",
                      backgroundColor:
                        selectedRoomId === room.id ? "#34495e" : "#7f8c8d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      margin: "0.25rem auto",
                      cursor: "pointer",
                    }}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Room Devices */}
      {selectedRoom && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fff",
            borderRadius: "6px",
            maxWidth: "700px",
            margin: "2rem auto",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Devices in {selectedRoom.name}
          </h2>

          {loadingDevices && <p>Loading devices...</p>}
          {error && <p>Error: {error}</p>}

          {!loadingDevices && !error && (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {roomDevices.map((device) => {
                const offStates = ["Off", "Muted", "Inactive"];
                return (
                  <li
                    key={device.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong>{device.name}</strong> ({device.type})
                    </div>

                    {/* Light Status */}
                    {device.isOn !== undefined && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Status: </strong>{" "}
                        <span
                          style={{ color: device.isOn ? "27ae60" : "e74c3c" }}
                        >
                          {device.isOn ? "On 💡" : "Off 🔌"}
                        </span>
                      </div>
                    )}

                    {/* Thermostat */}
                    {device.currentTemperature !== undefined && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Current Temp:</strong>{" "}
                        {device.currentTemperature}°C
                        <br />
                        <strong>Target Temp:</strong> {device.targetTemperature}
                        °C
                      </div>
                    )}

                    {/* Doorbell */}
                    {device.type === "Doorbell" && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Motion Detected:</strong>{" "}
                          {device.isMotionDetected ? "🚨 YES" : "No"}
                        </div>

                        {device.currentImage && (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${device.currentImage}`}
                            alt="Doorbell snapshot"
                            style={{
                              width: "200px",
                              height: "auto",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                              display: "block",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
