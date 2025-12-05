// GuestHub.jsx
import React, { useEffect, useState } from "react";
import { useRoomApi } from "../hooks/useRoomApi";


export default function GuestHub() {
  // prefer sessionStorage selectedRoomNumber if present, otherwise fallback to 101
  const stored = sessionStorage.getItem("selectedRoomNumber");
  const parsed = parseInt(stored, 10);
  const roomId = !isNaN(parsed) ? parsed : 101;

  const [room, setRoom] = useState(null);
  const { fetchRoomDevices, sendCommand, loading, error } = useRoomApi(roomId);

  // load devices
  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;
    const loadDevices = async () => {
      try {
        const devices = await fetchRoomDevices();
        if (!cancelled) setRoom({ name: `Room ${roomId}`, devices });
      } catch (err) {
        // fetchRoomDevices might already set error in hook; otherwise log
        console.error("Failed to load devices:", err);
      }
    };
    loadDevices();
    return () => {
      cancelled = true;
    };
  }, [roomId, fetchRoomDevices]);

  const refreshDevices = async () => {
    try {
      const devices = await fetchRoomDevices();
      setRoom({ name: `Room ${roomId}`, devices });
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const handleCommand = async (deviceId, command) => {
    try {
      const success = await sendCommand(roomId, deviceId, command);
      if (success) {
        await refreshDevices();
      } else {
        // optionally show feedback, or implement toast - left simple here
        console.warn("Command returned unsuccessful:", command);
      }
    } catch (err) {
      console.error("Command failed:", err);
    }
  };

  // simple styles object so no Tailwind/CSS frameworks are required
  const styles = {
    page: {
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: "#f5f7fa",
      fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: "#1f2937",
    },
    container: {
      maxWidth: 800,
      margin: "0 auto",
      background: "#fff",
      padding: "1.25rem",
      borderRadius: 8,
      boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
    },
    header: {
      textAlign: "center",
      marginBottom: "1rem",
    },
    roomTitle: {
      fontSize: "2rem",
      margin: 0,
      fontWeight: 600,
      color: "#0f172a",
    },
    sub: { color: "#6b7280", marginTop: 6 },
    list: { listStyle: "none", padding: 0, margin: 0 },
    listItem: {
      padding: "0.75rem 0.5rem",
      borderBottom: "1px solid #e6e9ef",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    },
    deviceInfo: { flex: 1 },
    controls: { display: "flex", gap: 8, alignItems: "center", marginTop: 8, flexWrap: "wrap" },
    button: {
      padding: "6px 10px",
      borderRadius: 6,
      border: "1px solid #cbd5e1",
      background: "#fff",
      cursor: "pointer",
      fontSize: 14,
    },
    primaryButton: {
      padding: "6px 10px",
      borderRadius: 6,
      border: "none",
      background: "#0ea5a4",
      color: "#fff",
      cursor: "pointer",
      fontSize: 14,
    },
    smallInput: { width: 80, padding: "6px 8px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 },
    meta: { fontSize: 13, color: "#6b7280" },
    sectionBox: { marginTop: 10, padding: 10, background: "#fbfdff", borderRadius: 6, border: "1px solid #eef2f7" },
  };

  if (loading && !room) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", marginTop: 120 }}>
          <div>Loading room data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", marginTop: 120 }}>
          <div style={{ color: "#b91c1c", fontWeight: 600 }}>Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", marginTop: 120 }}>
          <div style={{ color: "#374151" }}>No room data available.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.roomTitle}>Welcome to {room.name}</h1>
        <div style={styles.sub}>Control the devices for this room</div>
      </header>

      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Your Devices</h2>
          <div>
            <button style={styles.button} onClick={refreshDevices} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {room.devices.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: "#6b7280" }}>No devices found in this room.</div>
        ) : (
          <ul style={styles.list}>
            {room.devices.map((device) => (
              <li key={device.id} style={styles.listItem}>
                <div style={styles.deviceInfo}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{device.name}</div>
                      <div style={styles.meta}>{device.type}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {/* simple emoji indicator */}
                      <div style={{ fontSize: 20 }}>{device.isOn ? "💡" : "🔌"}</div>
                    </div>
                  </div>

                  {/* Controls area */}
                  <div style={styles.controls}>
                    {/* Light controls */}
                    {device.isOn !== undefined && (
                      <>
                        <button
                          style={device.isOn ? styles.primaryButton : styles.button}
                          onClick={() => handleCommand(device.id, "TurnOn")}
                        >
                          On
                        </button>
                        <button
                          style={!device.isOn ? styles.primaryButton : styles.button}
                          onClick={() => handleCommand(device.id, "TurnOff")}
                        >
                          Off
                        </button>
                      </>
                    )}

                    {/* Thermostat */}
                    {device.targetTemperature !== undefined && (
                      <div style={{ minWidth: 220 }}>
                        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Temperature</div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{device.currentTemperature ?? "--"}°C</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>current</div>
                          </div>

                          <div style={{ marginLeft: "auto" }}>
                            <input
                              type="number"
                              defaultValue={device.targetTemperature}
                              onBlur={(e) => {
                                const newTemp = e.target.value;
                                const currentTemp = device.targetTemperature?.toString() || "";
                                if (newTemp && newTemp !== currentTemp) {
                                  handleCommand(device.id, `SetTemperature ${newTemp}`);
                                }
                              }}
                              min="10"
                              max="30"
                              style={styles.smallInput}
                            />
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, textAlign: "center" }}>°C</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HVAC controls */}
                    {(device.Mode !== undefined || device.FanSpeed !== undefined) && (
                      <div style={styles.sectionBox}>
                        {device.Mode !== undefined && (
                          <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}>Mode</label>
                            <select
                              value={device.Mode}
                              onChange={(e) => handleCommand(device.id, `setMode ${e.target.value}`)}
                              style={styles.smallInput}
                            >
                              <option value="Fan">Fan</option>
                              <option value="Cool">Cool</option>
                              <option value="Heat">Heat</option>
                            </select>
                          </div>
                        )}

                        {device.FanSpeed !== undefined && (
                          <div>
                            <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}>Fan Speed</label>
                            <select
                              value={device.FanSpeed}
                              onChange={(e) => handleCommand(device.id, `setFanSpeed ${e.target.value}`)}
                              style={styles.smallInput}
                            >
                              <option value={1}>Low</option>
                              <option value={2}>Medium</option>
                              <option value={3}>High</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
