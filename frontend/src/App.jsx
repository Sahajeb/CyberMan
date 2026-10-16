import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import ScanEmail from "./pages/ScanEmail";
import ScanUrl from "./pages/ScanUrl";
import Vault from "./pages/Vault";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="scan-email" element={<ScanEmail />} />
          <Route path="scan-url" element={<ScanUrl />} />
          <Route path="vault" element={<Vault />} />
          <Route path="report" element={<Report />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
