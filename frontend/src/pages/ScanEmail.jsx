import React, { useState } from "react";
import {
  FaPaste,
  FaShieldAlt,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import api from "../api/api";
import "../styles/scanEmail.css";

const ScanEmail = () => {
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePaste = async (field) => {
    try {
      const text = await navigator.clipboard.readText();
      field === "sender" ? setSender(text) : setContent(text);
    } catch {
      setResult({ message: "Clipboard permission denied", type: "warning" });
    }
  };

  const handleScan = async () => {
    if (!sender || !content) {
      setResult({ message: "All fields are required!", type: "warning" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post("/scan", {
        senderEmail: sender,
        content: content,
      });

      const data = response.data;

      let type = "safe";
      if (data.prediction === "PHISHING") type = "danger";
      else if (data.prediction === "SUSPICIOUS") type = "warning";

      setResult({
        prediction: data.prediction,
        confidence: parseFloat(data.confidence),
        type,
      });

    } catch (error) {
      if (error.response?.status === 401) {
        setResult({
          message: "Unauthorized. Please login again.",
          type: "danger",
        });
      } else {
        setResult({ message: "Scan failed!", type: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-page">
      <h1 className="scan-title">Scan Email</h1>

      <div className="scan-card">

        {/* Sender */}
        <div className="scan-input-group">
          <label>Sender Email</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="example@gmail.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <FaPaste
              className="paste-icon"
              onClick={() => handlePaste("sender")}
            />
          </div>
        </div>

        {/* Content */}
        <div className="scan-input-group">
          <label>Email Content</label>
          <div className="input-wrapper">
            <textarea
              placeholder="Paste suspicious email content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <FaPaste
              className="paste-icon textarea-icon"
              onClick={() => handlePaste("content")}
            />
          </div>
        </div>

        <button className="scan-btn" onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Scan Now"}
        </button>

        {result && (
          <div className={`scan-result ${result.type}`}>

            {result.prediction && (
              <>
                <h2 className="result-title">
                  {result.type === "danger"
                    ? "Phishing Detected"
                    : result.type === "warning"
                    ? "Suspicious Email"
                    : "Safe Email"}
                </h2>

                {/* 🔥 RISK DISPLAY */}
                <div className="risk-display">

                  <div className={`risk-icon ${result.type}`}>
                    {result.type === "danger" && <FaTimesCircle />}
                    {result.type === "warning" && <FaExclamationTriangle />}
                    {result.type === "safe" && <FaShieldAlt />}
                  </div>

                  <div className="risk-score">
                    {result.confidence}%
                  </div>

                  <div className="risk-verdict">
                    {result.type === "danger"
                      ? "High Risk – Phishing Email"
                      : result.type === "warning"
                      ? "Medium Risk – Suspicious Content"
                      : "Low Risk – Safe Email"}
                  </div>

                </div>
              </>
            )}

            {result.message && <p>{result.message}</p>}
          </div>
        )}

      </div>
    </div>
  );
};

export default ScanEmail;
