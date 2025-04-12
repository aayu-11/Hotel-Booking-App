import "./register.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
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
      const res = await axios.post("/auth/register", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="register">
      <div className="registerContainer">
        <div className="registerForm">
          <h2>Create Account</h2>
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
            <FontAwesomeIcon icon={faEnvelope} className="inputIcon" />
            <input
              type="email"
              placeholder="email"
              id="email"
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
            className="registerButton"
            onClick={handleClick}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
