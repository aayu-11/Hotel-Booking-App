import { Link } from "react-router-dom";
import "./navbar.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHotel } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user } = useContext(AuthContext);
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
            <FontAwesomeIcon icon={faUser} className="userIcon" />
            <span className="username">{user.username}</span>
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton">Register</button>
            <button className="navButton">Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
