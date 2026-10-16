import React, { useState, useEffect } from "react";
import {
  FaPaste,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaEdit,
  FaPlus,
  FaLock,
} from "react-icons/fa";
import api from "../api/api";
import "../styles/vault.css";

const Vault = () => {
  const [appName, setAppName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [vaultItems, setVaultItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // =============================
  // Load Vault Items
  // =============================
  const loadVault = async () => {
    try {
      const res = await api.get("/vault");
      setVaultItems(res.data);
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Failed to load vault data");
    }
  };

  useEffect(() => {
    loadVault();
  }, []);

  // =============================
  // Paste Password
  // =============================
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPassword(text);
    } catch {
      setMessage("Clipboard permission denied");
    }
  };

  // =============================
  // Save / Update
  // =============================
  const handleSave = async () => {
    if (!appName || !username || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        applicationName: appName,
        username,
        password,
      };

      if (editingId) {
        await api.put(`/vault/${editingId}`, payload);
        setMessage("Credential updated successfully");
      } else {
        await api.post("/vault", payload);
        setMessage("Credential saved successfully");
      }

      setAppName("");
      setUsername("");
      setPassword("");
      setEditingId(null);
      setShowAddForm(false);

      loadVault();
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Delete
  // =============================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/vault/${id}`);
      setMessage("Credential deleted");
      loadVault();
    } catch (error) {
      console.log(error.response?.data);
      setMessage("Delete failed");
    }
  };

  // =============================
  // Edit
  // =============================
  const handleEdit = (item) => {
    setAppName(item.appName);
    setUsername(item.username);
    setPassword(item.password);
    setEditingId(item.id);
    setShowAddForm(true);
  };

  // =============================
  // Copy
  // =============================
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setMessage("Password copied to clipboard");
  };

  return (
    <div className="vault-container">
      <div className="vault-wrapper">

        {/* Header */}
        <div className="vault-header">
          <div>
            <h1>🔐 Secure Vault</h1>
            <p>Manage and protect your digital credentials</p>
          </div>

          {!showAddForm && (
            <button
              className="primary-btn"
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus /> Add Credential
            </button>
          )}
        </div>

        {/* Message */}
        {message && <div className="vault-alert">{message}</div>}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="vault-form-card">
            <h2>{editingId ? "Edit Credential" : "Add Credential"}</h2>

            <div className="form-group">
              <label>Application</label>
              <input
                type="text"
                value={appName}
                placeholder="Gmail / Instagram"
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input">
                <input
                  type="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaPaste className="icon-btn" onClick={handlePaste} />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="primary-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Vault Grid */}
        {!showAddForm && (
          <div className="vault-grid">
            {vaultItems.length === 0 ? (
              <div className="empty-state">
                <FaLock size={50} />
                <h3>No Credentials Yet</h3>
                <p>Start securing your accounts safely.</p>
              </div>
            ) : (
              vaultItems.map((item) => (
                <div key={item.id} className="vault-card-item">
                  <div className="card-header">
                    <h3>{item.appName}</h3>
                    <span>{item.username}</span>
                  </div>

                  <div className="password-section">
                    <input
                      type={
                        visiblePasswordId === item.id
                          ? "text"
                          : "password"
                      }
                      value={item.password}
                      readOnly
                    />

                    {visiblePasswordId === item.id ? (
                      <FaEyeSlash
                        className="icon-btn"
                        onClick={() => setVisiblePasswordId(null)}
                      />
                    ) : (
                      <FaEye
                        className="icon-btn"
                        onClick={() =>
                          setVisiblePasswordId(item.id)
                        }
                      />
                    )}

                    <FaCopy
                      className="icon-btn"
                      onClick={() => handleCopy(item.password)}
                    />
                  </div>

                  <div className="card-actions">
                    <FaEdit onClick={() => handleEdit(item)} />
                    <FaTrash onClick={() => handleDelete(item.id)} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Vault;