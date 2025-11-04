import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HotelHub from "./HotelHub";
import GuestHub from "./GuestHub";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hotel" element={<HotelHub />} />
        <Route path="/guest" element={<GuestHub />} />
      </Routes>
    </Router>
  );
}

export default App;