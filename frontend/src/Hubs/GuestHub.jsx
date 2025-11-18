import { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";

export default function GuestHub() {
  const roomId = 101;
  const [room, setRoom] = useState(null);
  const { fetchRoomDevices, sendCommand, loading, error } = useRoomApi(roomId);

  // TODO: Implement proper useEffect() for GuestHub
  useEffect(() => {
    const loadDevices = async () => {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    };
    loadDevices();
  }, [roomId]);

  const handleCommand = async (deviceId, command) => {
    const success = await sendCommand(roomId, deviceId, command);
    if (success) {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    }
  };

  if (loading) return <p>Loading room data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!room) return <p>No room data available.</p>; // prevents crashes

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "600",
          marginBottom: "2rem",
          color: "#2c3e50",
        }}
      >
        Welcome to {room.name}
      </h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#34495e" }}
        >
          Your Devices
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.devices.map((device) => (
            <li
              key={device.id}
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid #ddd",
                fontSize: "1.1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{device.name}</strong> ({device.type})
                {/* Light Controls */}
                {device.isOn !== undefined && (
                  <span style={{ marginLeft: "1rem" }}>
                    <button
                      onClick={() => handleCommand(device.id, "TurnOn")}
                      style={{ marginRight: "0.5rem" }}
                    >
                      On
                    </button>
                    <button onClick={() => handleCommand(device.id, "TurnOff")}>
                      Off
                    </button>
                    <span style={{ marginLeft: "0.5rem" }}>
                      {device.isOn ? "💡" : "🔌"}
                    </span>
                  </span>
                )}
                {/* Thermostat Controls */}
                {device.targetTemperature !== undefined && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.25rem",
                        fontWeight: "500",
                      }}
                    >
                      Target Temperature: {device.targetTemperature}°C
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="number"
                        defaultValue={device.targetTemperature}
                        onBlur={(e) => {
                          const newTemp = e.target.value;
                          const currentTemp =
                            device.targetTemperature?.toString() || "";
                          if (newTemp && newTemp !== currentTemp) {
                            handleCommand(
                              device.id,
                              `SetTemperature ${newTemp}`
                            );
                          }
                        }}
                        style={{
                          width: "80px",
                          padding: "0.4rem",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "1rem",
                        }}
                        min="10"
                        max="30"
                      />
                      <span>°C</span>
                    </div>
                  </div>
                )}
                {/* HVAC Mode */}
                {device.Mode !== undefined && (
                  <select
                    value={device.Mode}
                    onChange={(e) =>
                      handleCommand(device.id, `setMode ${e.target.value}`)
                    }
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <option value="Fan">Fan</option>
                    <option value="Cool">Cool</option>
                    <option value="Heat">Heat</option>
                  </select>
                )}
                {/* HVAC Fan Speed */}
                {device.FanSpeed !== undefined && (
                  <select
                    value={device.FanSpeed}
                    onChange={(e) =>
                      handleCommand(device.id, `setFanSpeed ${e.target.value}`)
                    }
                    style={{ marginLeft: "0.5rem" }}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
