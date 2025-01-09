import React from "react";
import { Link } from "react-router-dom";

// Simple Navbar component
function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContent}>
        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
        <Link to="/recommendations" style={styles.navLink}>Recommendations</Link>
        <Link to="/movies" style={styles.navLink}>My Movies</Link>
        <Link to="/login" style={styles.navLink}>Login</Link>
        <Link to="/register" style={styles.navLink}>Register</Link>
        <Link to ="/watchlist" style={styles.navLink}>Watchlist</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px 20px",
    position: "sticky",
    top: "0",
    zIndex: "1000",
  },
  navbarContent: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    padding: "10px 15px",
    fontSize: "1.1rem",
    transition: "background-color 0.3s ease",
  },
};

export default Navbar;
