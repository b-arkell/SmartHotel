import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeviceHub from "./DeviceHub";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeviceHub />} />
      </Routes>
    </Router>
  );
}

export default App;
