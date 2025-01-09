import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchRatedMovies, addToWatchlist } from "../api";

const MoviePage = () => {
  const [movies, setMovies] = useState([]); // List of rated movies
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem("token"); // Auth token

  // Fetch rated movies when the component mounts
  useEffect(() => {
    const getRatedMovies = async () => {
      try {
        const response = await fetchRatedMovies(token);
        setMovies(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Please log in to view your rated movies.");
          } else {
            setError("Failed to fetch movies. Please try again later.");
          }
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false); // Stop loading after API call
      }
    };

    getRatedMovies();
  }, [token]);

  // Handle adding a movie to the watchlist
  const handleAddToWatchlist = async (movie) => {
    setError(""); // Reset error before attempting to add
    try {
      await addToWatchlist(movie, token);
      alert(`"${movie}" added to your watchlist!`);
    } catch (err) {
      // Explicitly handle Axios errors
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Please log in to add movies to your watchlist.");
        } else if (err.response?.status === 400) {
          setError(`"${movie}" is already in your watchlist.`);
        } else {
          setError("Failed to add movie to watchlist. Please try again.");
        }
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const styles = {
    container: {
      backgroundColor: "#f4f4f4", // Light background
      color: "#333", // Dark text for contrast
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Roboto', sans-serif",
    },
    header: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#444", // Slightly darker text
      textAlign: "center",
    },
    error: {
      color: "#e74c3c",
      fontSize: "1.2rem",
      textAlign: "center",
    },
    loading: {
      fontSize: "1.5rem",
      textAlign: "center",
      color: "#3498db",
    },
    cardContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      backgroundColor: "#fff", // White background for the card
      padding: "15px",
      outline: "solid 1px #2980b9", // Light border around the card
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for card effect
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardTitle: {
      fontSize: "1.4rem",
      fontWeight: "bold",
      color: "#2c3e50", // Darker title color
      marginBottom: "10px",
    },
    cardDetails: {
      fontSize: "1.1rem",
      color: "#7f8c8d", // Lighter text for the details
      marginBottom: "10px",
    },
    button: {
      backgroundColor: "#3498db", // Blue button
      border: "none",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#2980b9", // Darker blue on hover
    },
  };

  // Render loading state
  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your Rated Movies</h1>
      {error && <p style={styles.error}>{error}</p>}
      {movies.length === 0 ? (
        <p style={styles.loading}>You haven't rated any movies yet.</p>
      ) : (
        <div style={styles.cardContainer}>
          {movies.map((movie) => (
            <div key={movie.movie_id} style={styles.card}>
              <h3 style={styles.cardTitle}>{movie.movie_title}</h3>
              <p style={styles.cardDetails}>Rating: {movie.rating}/5</p>
              <button
                onClick={() =>
                  handleAddToWatchlist(movie.movie_title).catch((err) => {
                    console.error("Handled runtime error:", err);
                  })
                }
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                Add to Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviePage;
