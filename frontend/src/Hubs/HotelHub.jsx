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
      setRoomDevices(devices);
    };
    loadDevices();
  }, [selectedRoomId, fetchRoomDevices]);

  useEffect(() => {
    if (!selectedRoomId) return;

    const interval = setInterval(async () => {
      const devices = await fetchRoomDevices();
      setRoomDevices(devices);
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedRoomId, fetchRoomDevices]);

  const selectedFloor = hotel?.floors.find((f) => f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(
    (r) => r.id === selectedRoomId
  );

  const getDeviceIcon = (device) => {
    switch (device.type) {
      case "Light":
        return "💡";
      case "Thermostat":
        return "🌡️";
      case "Doorbell":
        return "🔔";
      case "Alarm":
        return "🚨";
      default:
        return "⚙️";
    }
  };

  if (loadingHotel) return <p className="center-text">Loading hotel...</p>;
  if (!hotel || !Array.isArray(hotel.floors) || hotel.floors.length === 0)
    return <p className="center-text">No hotel data available.</p>;

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <button onClick={() => window.history.back()} className="back-btn">
          ← Back
        </button>
        <h1>Admin Hub</h1>
      </header>

      {/* Floor Selection */}
      <div className="floors-container">
        {hotel.floors.map((floor) => (
          <div key={floor.id} className="floor-card">
            <button
              className={`floor-btn ${
                selectedFloorId === floor.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoomId(null);
                setRoomDevices([]);
              }}
            >
              {floor.name}
            </button>

            {selectedFloorId === floor.id && (
              <div className="rooms-container">
                {floor.rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`room-btn ${
                      selectedRoomId === room.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedRoomId(room.id)}
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
        <div className="devices-grid">
          {loadingDevices && <p>Loading devices...</p>}
          {error && <p className="error-text">Error: {error}</p>}

          {!loadingDevices &&
            !error &&
            roomDevices.map((device) => (
              <div key={device.id} className="device-card">
                <div className="device-header">
                  <span className="device-icon">{getDeviceIcon(device)}</span>
                  <strong>{device.name}</strong>{" "}
                  <span className="device-type">({device.type})</span>
                </div>

                {/* Light */}
                {device.isOn !== undefined && (
                  <div className="device-status">
                    <strong>Status:</strong>{" "}
                    <span className={device.isOn ? "on" : "off"}>
                      {device.isOn ? "On 💡" : "Off 🔌"}
                    </span>
                  </div>
                )}

                {/* Thermostat */}
                {device.currentTemperature !== undefined && (
                  <div className="thermostat">
                    <div>Current Temp: {device.currentTemperature}°C</div>
                    <div>Target Temp: {device.targetTemperature}°C</div>
                  </div>
                )}

                {/* Doorbell */}
                {device.type === "Doorbell" && (
                  <div className="doorbell">
                    <div>
                      Motion Detected:{" "}
                      {device.isMotionDetected ? "🚨 YES" : "No"}
                    </div>
                    {device.currentImage && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${device.currentImage}`}
                        alt="Doorbell snapshot"
                      />
                    )}
                  </div>
                )}

                {/* HVAC */}
                {device.mode !== undefined && (
                  <div className="device-status">
                    HVAC Mode:{" "}
                    {device.mode === 0
                      ? "Fan"
                      : device.mode === 1
                      ? "Cool ❄️"
                      : "Heat 🔥"}
                  </div>
                )}

                {device.fanSpeed !== undefined && (
                  <div className="device-status">
                    Fan Speed:{" "}
                    {device.fanSpeed === 1
                      ? "Low"
                      : device.fanSpeed === 2
                      ? "Medium"
                      : "High"}
                  </div>
                )}

                {device.type === "Alarm" && (
                  <div
                    className={`alarm ${
                      device.isAlarmTriggered ? "triggered" : ""
                    }`}
                  >
                    {device.isAlarmTriggered
                      ? "🚨 Alarm TRIGGERED"
                      : "Alarm Idle"}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      <style jsx>{`
        .page {
          font-family: "Roboto", "Segoe UI", sans-serif;
          background: #f9f9f9;
          min-height: 100vh;
          padding: 2rem;
        }
        .center-text {
          text-align: center;
          margin-top: 2rem;
        }

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
        .back-btn:hover {
          background-color: #155cb0;
        }
        .header h1 {
          font-weight: 500;
          font-size: 2rem;
          color: #202124;
          margin: 0 auto;
          text-align: center;
        }

        /* Floors */
        .floors-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .floor-card {
          text-align: center;
        }
        .floor-btn,
        .room-btn {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #2c3e50;
          color: white;
          transition: background 0.2s;
        }
        .floor-btn:hover,
        .room-btn:hover {
          background: #34495e;
        }
        .floor-btn.selected,
        .room-btn.selected {
          background: #1a73e8;
        }
        .rooms-container {
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Devices */
        .devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .device-card {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .device-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .device-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          margin-bottom: 0.8rem;
        }
        .device-icon {
          font-size: 1.3rem;
        }
        .device-type {
          font-weight: 400;
          color: #5f6368;
        }
        .device-status {
          margin-top: 0.4rem;
        }
        .on {
          color: #27ae60;
        }
        .off {
          color: #e74c3c;
        }
        .thermostat {
          margin-top: 0.5rem;
          padding: 0.4rem;
          background: #f1f3f4;
          border-radius: 8px;
        }
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
        .alarm.triggered {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}
