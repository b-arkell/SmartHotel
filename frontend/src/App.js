import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HotelHub from "./Hubs/HotelHub";
import GuestHub from "./Hubs/GuestHub";
import StartScreen from "./Hubs/StartScreen"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/hotel" element={<HotelHub />} />
        <Route path="/guest" element={<GuestHub />} />
      </Routes>
    </Router>
  );
}

export default App;