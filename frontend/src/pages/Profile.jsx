import { useAuth } from "../auth/AuthContext";
import { FaSignOutAlt, FaClock, FaEnvelope } from "react-icons/fa";
import "../styles/profile.css";

const Profile = () => {
  const { user, logout } = useAuth();

  const loginTime = localStorage.getItem("loginTime");

  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    return new Date(dateString).toLocaleString();
  };

  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-card-large">

        {/* BIG Avatar */}
        <div className="profile-avatar-large">
          <div className="avatar-circle-large">
            {getInitials()}
          </div>
        </div>

        {/* User Info */}
        <div className="profile-info-large">
          <h1 className="profile-name">{user?.fullName}</h1>

          <div className="profile-detail-large">
            <FaEnvelope className="profile-icon" />
            <span>{user?.email}</span>
          </div>

          <div className="profile-detail-large">
            {/* <FaClock className="profile-icon" /> */}
            {/* <span>Login Time: {formatDate(loginTime)}</span> */}
          </div>

          <button className="logout-btn-large" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>
      
    </div>
  );
};

export default Profile;
