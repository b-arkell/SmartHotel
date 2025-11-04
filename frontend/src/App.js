/* import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
*/



// THIS IS FOR TESTING // ABOVE IS THE REAL CODE //
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HotelHub from "./HotelHub";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HotelHub />} />
      </Routes>
    </Router>
  );
}

export default App;

