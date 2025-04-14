import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHotel,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>
          <div className="logo">
            <FontAwesomeIcon icon={faHotel} className="logoIcon" />
            <span className="logoText">StayHub</span>
          </div>
        </Link>
        {user ? (
          <div className="userInfo">
            <Link
              to="/profile"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <div className="profileLink">
                <FontAwesomeIcon icon={faUser} className="userIcon" />
                <span className="username">{user.username}</span>
              </div>
            </Link>
            <button className="navButton" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="logoutIcon" />
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
