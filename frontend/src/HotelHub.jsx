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
    <div style={{ padding: "1rem" }}>
      <h2>{hotel?.name ?? "Hotel"} Hub</h2>

      {hotel?.floors.map(floor => (
        <button key={floor.id} onClick={() => {
          setSelectedFloorId(floor.id);
          setSelectedRoomId(null);
        }}>
          {floor.name}
        </button>
      ))}

      {selectedFloor?.rooms.map(room => (
        <button key={room.id} onClick={() => setSelectedRoomId(room.id)}>
          {room.name}
        </button>
        ))}

      {selectedRoom?.devices.map(device => (
        <div key={device.id}>
          <strong>{device.name}</strong>: {device.status}
          </div>
      ))}

      </div>
  );
} 