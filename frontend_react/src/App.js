import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Recommendations from "./components/Recommendations";
import MoviePage from "./components/Movies";
import Navbar from "./components/Navbar";
import WatchlistPage from "./components/Watchlist";
import { fetchMovies } from "./api";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the movie list asynchronously
    const loadMovies = async () => {
      try {
        const response = await fetchMovies(); // Ensure `fetchMovies` returns a promise that resolves with the movie data
        setMovies(response.data); // Assuming `response.data` contains the list of movies
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return <div>Loading movies...</div>;
  }
  console.log(movies);
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        {/* Pass movies as props to the Recommendations and MoviePage components */}
        <Route path="/recommendations" element={<Recommendations movies={movies} />} />
        <Route path="/movies" element={<MoviePage movies={movies} />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
