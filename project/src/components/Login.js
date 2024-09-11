import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/logo.png"; // Import the image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      navigate("/admin");
    } else if (username === "aadhithya" && password === "21") {
      navigate("/student");
    } else if (username === "divya" && password === "0000") {
      navigate("/student");
    } else {
      setError(true);
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" /> {/* Use the imported image here */}

      <form onSubmit={(e) => e.preventDefault()}>

        <h1>Login</h1>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button onClick={handleLogin}>Login</button>
      </form>
      {error && <div className="error">Invalid credentials</div>}
    </div>
  );
};

export default Login;
