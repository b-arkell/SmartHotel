import { useState, useCallback } from "react";

export function useRoomApi(roomId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoomDevices = useCallback(async () => {
    if (!roomId) return [];

    setLoading(true);
    setError(null);

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
  }, []);

  const sendCommand = useCallback(async (roomId, deviceId, command) => {
    setError(null);

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
  }, []);

  return { fetchRoomDevices, sendCommand, loading, error };
}
