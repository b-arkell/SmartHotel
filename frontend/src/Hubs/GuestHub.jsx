import { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";

export default function GuestHub() {
  const storedRoomId = sessionStorage.getItem("selectedRoomNumber");
  const parsedRoomId = parseInt(storedRoomId, 10);
  const roomId = !isNaN(parsedRoomId) ? parsedRoomId : null;

  const [room, setRoom] = useState({ name: "", devices: [] });
  const { fetchRoomDevices, sendCommand, loading, error } = useRoomApi(roomId);

  useEffect(() => {
    if (!roomId) return;

    const loadDevices = async () => {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    };
    loadDevices();
  }, [roomId, fetchRoomDevices]);

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    }, 10000); // backend updates every 10 seconds

    return () => clearInterval(interval);
  }, [roomId, fetchRoomDevices]);

  const handleCommand = async (deviceId, command) => {
    if (!roomId) return;
    const success = await sendCommand(roomId, deviceId, command);
    if (success) {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    }
  };

  if (!roomId) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Error: No valid room selected.</p>;
  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading room data...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", backgroundColor: "#f5f5f5", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Header */}
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "600", marginBottom: "2rem", color: "#2c3e50" }}>
        Welcome to {room.name}
      </h1>

      {/* Devices Card */}
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "1.5rem",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#34495e", textAlign: "center" }}>Your Devices</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {room.devices.map(device => (
            <li key={device.id} style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong>{device.name}</strong> ({device.type})
                </div>

                {/* Light Controls */}
                {device.isOn !== undefined && (
                  <div>
                    <button
                      onClick={() => handleCommand(device.id, "TurnOn")}
                      style={{
                        marginRight: "0.5rem",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: device.isOn ? "#3498db" : "#ecf0f1",
                        color: device.isOn ? "white" : "black",
                        cursor: "pointer"
                      }}
                    >
                      On
                    </button>
                    <button
                      onClick={() => handleCommand(device.id, "TurnOff")}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: !device.isOn ? "#3498db" : "#ecf0f1",
                        color: !device.isOn ? "white" : "black",
                        cursor: "pointer"
                      }}
                    >
                      Off
                    </button>
                    <span style={{ marginLeft: "0.5rem" }}>{device.isOn ? "💡" : "🔌"}</span>
                  </div>
                )}

                {/* Thermostat Controls */}
                {device.targetTemperature !== undefined && (
                  <div style={{ marginTop: "0.75rem", padding: "0.5rem", backgroundColor: "#f0f0f0", borderRadius: "6px" }}>
                    <div>
                      <strong>Current:</strong> {device.currentTemperature ?? "--"}°C
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <input
                        type="number"
                        defaultValue={device.targetTemperature}
                        onBlur={e => {
                          const newTemp = e.target.value;
                          const currentTemp = device.targetTemperature?.toString() || "";
                          if (newTemp && newTemp !== currentTemp) handleCommand(device.id, `SetTemperature ${newTemp}`);
                        }}
                        style={{ width: "60px", padding: "0.3rem", border: "1px solid #ccc", borderRadius: "4px" }}
                        min="10"
                        max="30"
                      />
                      <span>°C</span>
                    </div>
                  </div>
                )}

                {/* HVAC Mode */}
                {device.mode !== undefined && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <strong>Mode:</strong>{" "}
                    <button onClick={() => handleCommand(device.id, "SetMode 0")} style={{ margin: "0 0.25rem" }}>
                      Fan {device.mode === 0 ? "✅" : ""}
                    </button>
                    <button onClick={() => handleCommand(device.id, "SetMode 1")} style={{ margin: "0 0.25rem" }}>
                      Cool ❄️ {device.mode === 1 ? "✅" : ""}
                    </button>
                    <button onClick={() => handleCommand(device.id, "SetMode 2")} style={{ margin: "0 0.25rem" }}>
                      Heat 🔥 {device.mode === 2 ? "✅" : ""}
                    </button>
                  </div>
                )}

                {/* Fan Speed */}
                {device.fanSpeed !== undefined && (
                  <div style={{ marginTop: "0.25rem" }}>
                    <strong>Fan Speed:</strong>{" "}
                    <select
                      value={device.fanSpeed}
                      onChange={e => handleCommand(device.id, `SetFanSpeed ${e.target.value}`)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <option value={1}>Low</option>
                      <option value={2}>Medium</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                )}

                {/* Doorbell */}
                {device.type === "Doorbell" && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <div><strong>Motion Detected:</strong> {device.isMotionDetected ? "🚨 YES" : "No"}</div>
                    {device.currentImage && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${device.currentImage}`}
                        alt="Doorbell"
                        style={{ marginTop: "0.5rem", width: "200px", borderRadius: "6px", border: "1px solid #ccc" }}
                      />
                    )}
                  </div>
                )}

                {/* Alarm */}
                {device.type === "Alarm" && (
                  <div style={{ marginTop: "0.5rem", fontWeight: "bold", color: device.isAlarmTriggered ? "red" : "gray" }}>
                    🔔 {device.isAlarmTriggered ? "Alarm TRIGGERED" : "Alarm Idle"}
                    <div style={{ marginTop: "0.25rem" }}>
                      {!device.isAlarmTriggered ? (
                        <button
                          onClick={() => handleCommand(device.id, "PlayAlarm")}
                          style={{ padding: "0.3rem 0.6rem", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Trigger Alarm
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCommand(device.id, "DisarmAlarm")}
                          style={{ padding: "0.3rem 0.6rem", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Disarm Alarm
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
