import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/main.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="16335357103-bhegfns7i0l6vcju0uc0hmbkbav9j6t4.apps.googleusercontent.com">
  <AuthProvider>
    <App />
  </AuthProvider>
</GoogleOAuthProvider>
  </React.StrictMode>
);
