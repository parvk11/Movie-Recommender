import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import Register from "./Register"; // Import the Register page

function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      localStorage.setItem("token", response.data.access_token); // Save token
      localStorage.setItem("username", username); // Save username
      console.log("Login successful");
      console.log(localStorage.getItem("token"));
      console.log(response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid credentials");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to the register page
  };

  const styles = {
    container: {
      backgroundColor: "#121212",
      color: "#fff",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      backgroundColor: "#333",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "300px",
    },
    header: {
      fontSize: "1.5rem",
      marginBottom: "20px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "4px",
      border: "1px solid #555",
      backgroundColor: "#444",
      color: "#fff",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      marginBottom: "10px", // Add margin for spacing between buttons
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    registerButton: {
      backgroundColor: "#28a745", // Green color for the register button
    },
    registerButtonHover: {
      backgroundColor: "#218838",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.header}>Login</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          style={styles.button}
          type="submit"
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Login
        </button>
        <button
          style={{ ...styles.button, ...styles.registerButton }}
          type="button"
          onClick={handleRegisterClick}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.registerButtonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.registerButton.backgroundColor)}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;
