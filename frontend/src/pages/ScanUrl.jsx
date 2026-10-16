import React, { useState } from "react";
import { FaPaste } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import "../styles/scanEmail.css";

const COLORS = ["#ff4d4f", "#faad14", "#52c41a", "#1890ff"];

const ScanUrl = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Validate URL
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // ✅ Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      setResult({
        message: "Clipboard permission denied",
        type: "warning",
      });
    }
  };

  // ✅ Scan URL
  const handleScan = async () => {
    if (!url.trim()) {
      setResult({ message: "URL is required", type: "warning" });
      return;
    }

    if (!isValidUrl(url.trim())) {
      setResult({ message: "Invalid URL format", type: "warning" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post("/Url/scan", {
        url: url.trim(),
      });

      const data = response.data;

      // ✅ Compute SAFE / NOT SAFE from backend stats
      const isNotSafe =
        data.malicious > 0 || data.suspicious > 0;

      const verdictMessage = isNotSafe ? "Danger" : "SAFE";
      const verdictType = isNotSafe ? "danger" : "safe";

      setResult({
        message: verdictMessage,
        type: verdictType,
        stats: data,
      });

    } catch (error) {
      setResult({
        message: "Scan failed. Try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prepare chart data
  const getChartData = () => {
    if (!result?.stats) return [];

    return [
      { name: "Malicious", value: result.stats.malicious || 0 },
      { name: "Suspicious", value: result.stats.suspicious || 0 },
      { name: "Harmless", value: result.stats.harmless || 0 },
      { name: "Undetected", value: result.stats.undetected || 0 },
    ];
  };

  return (
    <div className="scan-page">
      <h1 className="scan-title">Scan URL</h1>

      <div className="scan-card">
        <div className="scan-input-group">
          <label>Enter URL</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <FaPaste
              className="paste-icon"
              onClick={handlePaste}
            />
          </div>
        </div>

        <button
          className="scan-btn"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan Now"}
        </button>

        {result && (
          <div className={`scan-result ${result.type}`}>
            <h2>
              Verdict: {result.message}
            </h2>

            {result.stats && (
              <>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getChartData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {getChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="scan-stats">
                  <p>🔴 Malicious: {result.stats.malicious}</p>
                  <p>🟡 Suspicious: {result.stats.suspicious}</p>
                  <p>🟢 Harmless: {result.stats.harmless}</p>
                  <p>🔵 Undetected: {result.stats.undetected}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanUrl;
