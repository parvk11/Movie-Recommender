import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();

  // Check if user is logged in by looking for a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      // If no token is found, redirect to login page
      navigate("/login");
    } else if (storedUsername) {
      // If username exists in localStorage, set it in the state
      setUsername(storedUsername);
    }
    
    setLoading(false); // Once the check is complete, stop loading
  }, [navigate]);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>; // Show loading message while checking login status
  }

  return (
    <div style={styles.dashboardContainer}>
      <h2 style={styles.greeting}>
        {username ? `Hello, ${username}` : "Welcome to Movie Recommender"}
      </h2>
      {/* <div style={styles.introText}>
        <p>Discover personalized movie recommendations and manage your ratings.</p>
      </div> */}
      <div style={styles.dashboardCard}>
        <Link to="/recommendations" style={styles.dashboardLink}>
          <button style={styles.actionBtn}>Get Movie Recommendations</button>
        </Link>
        <Link to="/movies" style={styles.dashboardLink}>
          <button style={styles.actionBtn}>See My Rated Movies</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  // Dashboard Container
  dashboardContainer: {
    backgroundImage: 'url("https://img.freepik.com/free-vector/dark-gradient-background-with-copy-space_53876-99548.jpg")',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: "'Arial', sans-serif",
    color: '#333',
    backgroundSize: 'cover',
    backgroundPosition: 'center',

  },
  greeting: {
    fontSize: '4rem',
    color: 'white',
    fontWeight: '600',
    marginBottom: '20px',
  },
  introText: {
    fontSize: '1.2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    marginBottom: '40px',
    textAlign: 'center',
    maxWidth: '600px',
  },
  dashboardCard: {
    // backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '80%',
    maxWidth: '500px',
  },
  dashboardLink: {
    display: 'block',
    textDecoration: 'none',
    marginBottom: '20px',
  },
  actionBtn: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    // borderRadius: '5px',
    outline: 'black',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  actionBtnHover: {
    backgroundColor: '#2980b9',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginTop: '100px',
  }
};

export default Dashboard;
