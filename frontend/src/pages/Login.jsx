import React, { useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      await login(res.data.token);
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      // 🔥 Network error (backend not running)
      if (!error.response) {
        setErrorMessage("⚠️ Network error: Backend server is not running.");
      }
      // 🔥 Invalid credentials
      else if (error.response.status === 401) {
        setErrorMessage("❌ Invalid email or password.");
      }
      // 🔥 Other backend errors
      else {
        setErrorMessage(
          error.response.data?.message || "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });

      await login(res.data.token);
      navigate("/dashboard");

    } catch (error) {
      console.error("Google Login Error:", error);

      if (!error.response) {
        setErrorMessage("⚠️ Network error: Backend server is not running.");
      } else {
        setErrorMessage("❌ Google login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to continue your workflow
          </p>

          <form onSubmit={handleLogin}>
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

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {/* Login Button */}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ margin: "20px 0", textAlign: "center" }}>
            OR
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMessage("Google Sign-In Failed")}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
