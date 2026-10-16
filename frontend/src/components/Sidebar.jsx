import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      

      <NavLink to="/dashboard" end>
        Dashboard
      </NavLink>

      <NavLink to="/dashboard/scan-email">
        Scan Email
      </NavLink>

      <NavLink to="/dashboard/scan-url">
        Scan URL
      </NavLink>

      <NavLink to="/dashboard/vault">
        Vault
      </NavLink>
      <NavLink to="/dashboard/report">
        Report
      </NavLink>

      <NavLink to="/dashboard/profile">
        Profile
      </NavLink>
      
    </div>
  );
};

export default Sidebar;
