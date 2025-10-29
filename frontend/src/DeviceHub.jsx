import { useEffect, useState } from "react";

export default function DeviceHub() {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/device`)
      .then((res) => res.json())
      .then((data) => {
        setDevice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading device...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Device Control</h2>
      <p>
        {device.name}: {device.status}
      </p>
      {/* Later we can add buttons to toggle On/Off */}
    </div>
  );
}
