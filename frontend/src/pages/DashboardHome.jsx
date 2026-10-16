import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/dashboardHome.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const DashboardHome = () => {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard load failed");
    }
  };

  if (!stats) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  /* ----------------------------- */
  /* Email Threat Distribution     */
  /* ----------------------------- */

  const emailChart = [
    { name: "Phishing", value: stats.phishingEmails },
    { name: "Safe", value: stats.safeEmails },
  ];

  const emailColors = ["#ef4444", "#22c55e"];

  /* ----------------------------- */
  /* URL Risk Level Chart          */
  /* ----------------------------- */

  const urlRiskData = [
    { name: "High Risk", value: stats.highRiskUrls },
    { name: "Medium Risk", value: stats.mediumRiskUrls },
    { name: "Low Risk", value: stats.lowRiskUrls },
  ];

  return (
    <div className="dashboard-content">

      <h1 className="dashboard-title">Security Dashboard</h1>

      {/* ========================= */}
      {/* STAT CARDS                */}
      {/* ========================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Email Scans</h3>
          <p>{stats.totalEmailScans}</p>
        </div>

        <div className="stat-card">
          <h3>Total URL Scans</h3>
          <p>{stats.totalUrlScans}</p>
        </div>

        <div className="stat-card">
          <h3>Vault Items</h3>
          <p>{stats.vaultItems}</p>
        </div>

      </div>

      {/* ========================= */}
      {/* CHARTS                    */}
      {/* ========================= */}

      <div className="charts-grid">

        {/* EMAIL THREAT PIE */}

        <div className="chart-card">
          <h3>Email Threat Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={emailChart}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {emailChart.map((entry, index) => (
                  <Cell key={index} fill={emailColors[index]} />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* URL RISK BAR CHART */}

        <div className="chart-card">
          <h3>URL Risk Levels</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={urlRiskData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip />

              <Bar dataKey="value" fill="#00e676" />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ========================= */}
      {/* RECENT ACTIVITY           */}
      {/* ========================= */}

      <div className="activity-card">

        <h3>Recent Scan Activity</h3>

        <table className="activity-table">

          <thead>
            <tr>
              <th>Type</th>
              <th>Target</th>
              <th>Result</th>
              <th>Risk</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>

            {stats.recentActivities.map((item, index) => (
              <tr key={index}>

                <td>{item.type}</td>

                <td className="target">{item.target}</td>

                <td>{item.result}</td>

                <td>
                  <span className={`risk ${item.riskLevel?.toLowerCase()}`}>
                    {item.riskLevel}
                  </span>
                </td>

                <td>
                  {new Date(item.time).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DashboardHome;