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
    }, 10000);

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

  if (!roomId) return <p className="center-text">Error: No valid room selected.</p>;
  if (loading) return <p className="center-text">Loading room data...</p>;
  if (error) return <p className="center-text error-text">Error: {error}</p>;

  const getDeviceIcon = (device) => {
    switch (device.type) {
      case "Light": return "💡";
      case "Thermostat": return "🌡️";
      case "Doorbell": return "🔔";
      case "Alarm": return "🚨";
      default: return "⚙️";
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <button
          onClick={() => window.history.back()}
          className="back-btn"
        >
          ← Back
        </button>
        <h1>Welcome to {room.name}</h1>
      </header>

      {/* Devices Grid */}
      <main className="devices-grid">
        {room.devices.map((device) => (
          <div key={device.id} className="device-card">
            <div className="device-header">
              <span className="device-icon">{getDeviceIcon(device)}</span>
              <strong>{device.name}</strong> <span className="device-type">({device.type})</span>
            </div>

            {/* Light Controls */}
            {device.isOn !== undefined && (
              <div className="device-controls">
                <button
                  className={`btn ${device.isOn ? "active" : ""}`}
                  onClick={() => handleCommand(device.id, "TurnOn")}
                >
                  On
                </button>
                <button
                  className={`btn ${!device.isOn ? "active" : ""}`}
                  onClick={() => handleCommand(device.id, "TurnOff")}
                >
                  Off
                </button>
                <span className="status-icon">{device.isOn ? "💡" : "🔌"}</span>
              </div>
            )}

            {/* Thermostat */}
            {device.targetTemperature !== undefined && (
              <div className="thermostat">
                <div>Current: {device.currentTemperature ?? "--"}°C</div>
                <div className="temp-input">
                  <input
                    type="number"
                    defaultValue={device.targetTemperature}
                    onBlur={(e) => {
                      const newTemp = e.target.value;
                      if (newTemp !== device.targetTemperature.toString())
                        handleCommand(device.id, `SetTemperature ${newTemp}`);
                    }}
                    min="10"
                    max="30"
                  />
                  °C
                </div>
              </div>
            )}

            {/* Mode Controls */}
            {device.mode !== undefined && (
              <div className="mode-controls">
                <span>Mode:</span>
                <button className={device.mode === 0 ? "selected" : ""} onClick={() => handleCommand(device.id, "SetMode 0")}>Fan</button>
                <button className={device.mode === 1 ? "selected" : ""} onClick={() => handleCommand(device.id, "SetMode 1")}>Cool ❄️</button>
                <button className={device.mode === 2 ? "selected" : ""} onClick={() => handleCommand(device.id, "SetMode 2")}>Heat 🔥</button>
              </div>
            )}

            {/* Fan Speed */}
            {device.fanSpeed !== undefined && (
              <div className="fan-speed">
                <span>Fan Speed:</span>
                <select
                  value={device.fanSpeed}
                  onChange={(e) => handleCommand(device.id, `SetFanSpeed ${e.target.value}`)}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </select>
              </div>
            )}

            {/* Doorbell */}
            {device.type === "Doorbell" && (
              <div className="doorbell">
                <div>Motion Detected: {device.isMotionDetected ? "🚨 YES" : "No"}</div>
                {device.currentImage && (
                  <img src={`${process.env.REACT_APP_API_URL}/${device.currentImage}`} alt="Doorbell" />
                )}
              </div>
            )}

            {/* Alarm */}
            {device.type === "Alarm" && (
              <div className={`alarm ${device.isAlarmTriggered ? "triggered" : ""}`}>
                {device.isAlarmTriggered ? "🚨 Alarm TRIGGERED" : "Alarm Idle"}
                <div>
                  {device.isAlarmTriggered ? (
                    <button onClick={() => handleCommand(device.id, "DisarmAlarm")}>Disarm</button>
                  ) : (
                    <button onClick={() => handleCommand(device.id, "PlayAlarm")}>Trigger</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Styles */}
      <style jsx>{`
        .page {
          font-family: 'Roboto', 'Segoe UI', sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
          padding: 2rem;
        }
        .center-text { text-align: center; margin-top: 2rem; }
        .error-text { color: #e74c3c; }

        /* Header */
        .header {
          display: flex;
          align-items: center;
          position: relative;
          padding-bottom: 1rem;
        }
        .back-btn {
          position: absolute;
          left: 0;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          border: none;
          background-color: #1a73e8;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        .back-btn:hover { background-color: #155cb0; }
        .header h1 {
          font-weight: 500;
          font-size: 2rem;
          color: #202124;
          margin: 0 auto;
          text-align: center;
        }

        .devices-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          max-width: 1000px;
          margin: 2rem auto;
        }

        .device-card {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .device-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .device-header {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .device-icon { font-size: 1.3rem; }
        .device-type { font-weight: 400; color: #5f6368; }

        .device-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .btn {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 4px;
          background: #e0e0e0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn.active { background: #1a73e8; color: white; }
        .btn:hover { background: #cfd8dc; }

        .status-icon { margin-left: 0.5rem; }

        .thermostat {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f1f3f4;
          border-radius: 8px;
        }
        .temp-input { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; }
        input[type='number'] {
          width: 60px;
          padding: 0.3rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .mode-controls {
          margin-top: 0.5rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .mode-controls button {
          border-radius: 4px;
          border: none;
          padding: 0.3rem 0.6rem;
          cursor: pointer;
          background: #e0e0e0;
          transition: background 0.2s;
        }
        .mode-controls button.selected { background: #1a73e8; color: white; }
        .mode-controls button:hover { background: #cfd8dc; }

        .fan-speed { margin-top: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }

        .doorbell img {
          margin-top: 0.5rem;
          width: 100%;
          max-width: 220px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .alarm {
          margin-top: 0.5rem;
          font-weight: 500;
          color: gray;
        }
        .alarm.triggered { color: #e74c3c; }
        .alarm button {
          margin-top: 0.25rem;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          color: white;
          background: #e74c3c;
          transition: background 0.2s;
        }
        .alarm button:hover { background: #c0392b; }
      `}</style>
    </div>
  );
}
