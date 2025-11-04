import { useEffect, useState } from "react";

export default function HotelHub() {
  const[hotel, setHotel] = useState(null);
  const[selectedFloorId ,setSelectedFloorId] = useState(null);
  const[selectedRoomId, setSelectedRoomId] = useState(null);
  const[loading, setLoading] = useState(true);

  /* TODO: Implement proper useEffect()
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/hotel`)
      .then((res) => res.json())
      .then((data) => {
        setHotel(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []); */

useEffect(() => {     // Dummy hotel data 
    const mockHotel = {
      id: 1,
      name: "Smart Hotel",
      floors: [
        {
          id: 101,
          name: "Floor 1",
          rooms: [
            {
              id: 201,
              name: "Room A",
              devices: [
                { id: 1, name: "Thermostat", status: "On", type: "Thermostat" },
                { id: 2, name: "Camera", status: "Active", type: "Camera" }
              ]
            },
            {
              id: 202,
              name: "Room B",
              devices: [
                { id: 3, name: "Light", status: "Off", type: "Light" }
              ]
            }
          ]
        },
        {
          id: 102,
          name: "Floor 2",
          rooms: [
            {
              id: 203,
              name: "Room C",
              devices: [
                { id: 4, name: "Speaker", status: "Muted", type: "Speaker" }
              ]
            }
          ]
        }
      ]
    };

    setHotel(mockHotel);
    
    // TODO: Implement loading
    setLoading(false);
}, []);

  // To match the floor obj to the selected + find room obj in selected floor
  const selectedFloor = hotel?.floors.find(f=>f.id === selectedFloorId);
  const selectedRoom = selectedFloor?.rooms.find(r=>r.id === selectedRoomId)

  if (loading) return <p>Loading device...</p>;
  if (!hotel) return <p>No hotel data available.</p>; // prevents crashes

return (
    <div style={{
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: "#f5f5f5",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h1 style={{
        textAlign: "center",
        fontSize: "3rem",
        fontWeight: "600",
        marginBottom: "2rem",
        color: "#2c3e50"
      }}>
        {hotel.name} Hub
      </h1>

      {/* Floor Buttons */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        {hotel.floors.map(floor => (
          <div key={floor.id} style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoomId(null);
              }}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                backgroundColor: "#2c3e50",
                color: "#fff",
                border: "none",
                borderRadius: "4px", // Less rounded
                cursor: "pointer",
                marginBottom: "0.5rem"
              }}
            >
              {floor.name}
            </button>

            {/* Room Buttons */}
            {selectedFloorId === floor.id && (
              <div style={{ marginTop: "0.5rem" }}>
                {floor.rooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      backgroundColor: "#7f8c8d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px", // Less rounded
                      margin: "0.25rem auto",
                      cursor: "pointer"
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

      {/* Device Display */}
      {selectedRoom && (
        <div style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.8rem", color: "#34495e" }}>
            Devices in {selectedRoom.name}
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {selectedRoom.devices.map(device => {
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
      )}
    </div>
  );
} 