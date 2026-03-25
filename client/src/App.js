import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookToken from "./pages/BookToken";
import QueueStatus from "./pages/QueueStatus";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Profile from "./pages/Profile";
import TrackToken from "./pages/TrackToken";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book" element={<BookToken />} />
        <Route path="/queue-status" element={<QueueStatus />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/track-token" element={<TrackToken />} />
      </Routes>
    </Router>
  );
}

export default App;