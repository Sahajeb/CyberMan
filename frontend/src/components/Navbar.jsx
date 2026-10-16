import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../images/logo_CMB.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="CyberMan Logo" height="32" />
        CYBER<span>MAN</span>
      </div>

      <div className="nav-actions">
        {!user ? (
          <>
            <Link to="/login" className="login">Sign In</Link>
            <Link to="/register" className="register">Get Shielded</Link>
          </>
        ) : (
          <>
            <span className="username">
              {user.fullName}
            </span>

            <button onClick={handleLogout} className="logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
