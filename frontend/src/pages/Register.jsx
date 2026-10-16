import React, { useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await api.post("/auth/register", {
        fullName,
        emailAddress: email,
        password,
      });

      navigate("/login");

    } catch (err) {
      console.error("Register Error:", err);

      // 🔥 Network error (backend not running)
      if (!err.response) {
        setErrors(["⚠️ Network error: Backend server is not running."]);
      }

      // 🔥 Identity errors (ASP.NET Identity format)
      else if (Array.isArray(err.response.data)) {
        const backendErrors = err.response.data.map(e => e.description);
        setErrors(backendErrors);
      }

      // 🔥 Model validation errors
      else if (err.response?.data?.errors) {
        const modelErrors = Object.values(err.response.data.errors).flat();
        setErrors(modelErrors);
      }

      // 🔥 Fallback error
      else {
        setErrors(["Registration failed. Please try again."]);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Sign up to start using CyberMan
          </p>

          {errors.length > 0 && (
            <div className="error-box">
              {errors.map((err, index) => (
                <p key={index} className="error-text">
                  {err}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password with toggle */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Button */}
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
