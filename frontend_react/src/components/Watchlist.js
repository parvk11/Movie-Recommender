import React, { useEffect, useState } from "react";
import { fetchWatchlist, deleteWatchlist } from "../api"; // Import the API call

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    const getWatchlist = async () => {
      try {
        const response = await fetchWatchlist(token);
        setWatchlist(response.data); // Set the fetched watchlist
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch your watchlist. Please try again later.");
        console.log("Error fetching watchlist:", err);
      } finally {
        setLoading(false);
      }
    };

    getWatchlist();
  }, [token]);

  const handleDelete = async (movie_id) => {
    try {
      console.log(movie_id);
      await deleteWatchlist(movie_id, token); // Call the API to delete the movie
      const response = await fetchWatchlist(token); // Fetch the updated watchlist
      setWatchlist(response.data); // Update the watchlist
    } catch (err) {
      console.error("Failed to delete movie from watchlist:", err);
      alert("An error occurred while deleting the movie. Please try again.");
    }
  };

  const styles = {
    container: {
      backgroundColor: "white",
      color: "#fff",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      fontSize: "3rem",
      marginBottom: "20px",
      textAlign: "center",
      color: "black",
    },
    list: {
      listStyleType: "none",
      padding: "0",
    },
    listItem: {
      backgroundColor: "#eaeded",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      fontSize: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
    movieTitle: {
      flexGrow: 1,
      fontWeight: "bold",
      fontSize: "1.6rem",
      color: "#333",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "8px 15px",
      cursor: "pointer",
      fontSize: "1.2rem",
      transition: "background-color 0.3s",
    },
    deleteButtonHover: {
      backgroundColor: "#c0392b",
    },
    error: {
      color: "red",
      fontSize: "1.2rem",
      textAlign: "center",
    },
    loading: {
      fontSize: "1.2rem",
      textAlign: "center",
      color: "#bbb",
    },
    noMoviesMessage: {
      color: "#bbb",
      fontSize: "1.5rem",
      textAlign: "center",
    },
  };

  if (loading) {
    return <p style={styles.loading}>Loading your watchlist...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p style={styles.noMoviesMessage}>Your watchlist is empty.</p>
      ) : (
        <ol style={styles.list}>
          {watchlist.map((movie) => (
            <li key={movie} style={styles.listItem}>
              <span style={styles.movieTitle}>{movie}</span>
              <button
                onClick={() => handleDelete(movie)}
                style={styles.deleteButton}
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.deleteButton.backgroundColor)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default WatchlistPage;
