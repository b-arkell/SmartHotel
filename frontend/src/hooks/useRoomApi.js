import { useState, useCallback } from "react";

export function useRoomApi(roomId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/Room/${roomId}/devices`
      );
      if (!response.ok) throw new Error("Error fetching room devices");

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async (roomId, deviceId, command) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/Room/${roomId}/${deviceId}/command`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        }
      );

      if (!response.ok) throw new Error("Error sending command to device");
      return true; // Indicate success
    } catch (err) {
      setError(err.message);
      return false; // Indicate failure
    }
  };
  return { fetchRoomDevices, sendCommand, loading, error };
}
