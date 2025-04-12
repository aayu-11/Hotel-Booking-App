import "./login.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDebouncedChange = useDebounce((id, value) => {
    setCredentials((prev) => ({ ...prev, [id]: value }));
  }, 300);

  const handleChange = (e) => {
    handleDebouncedChange(e.target.id, e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginForm">
          <h2>Welcome Back</h2>
          <div className="inputGroup">
            <FontAwesomeIcon icon={faUser} className="inputIcon" />
            <input
              type="text"
              placeholder="username"
              id="username"
              onChange={handleChange}
            />
          </div>
          <div className="inputGroup">
            <FontAwesomeIcon icon={faLock} className="inputIcon" />
            <input
              type="password"
              placeholder="password"
              id="password"
              onChange={handleChange}
            />
          </div>
          {error && <div className="errorMessage">{error.message}</div>}
          <button
            disabled={loading}
            className="loginButton"
            onClick={handleClick}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
