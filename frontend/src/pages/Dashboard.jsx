import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout><div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-wrapper">
        <div className="dashboard-main">
          <Outlet /> {/* Nested routes render here */}
        </div>
      </div>
    </div></Layout>
  );
};

export default Dashboard;
