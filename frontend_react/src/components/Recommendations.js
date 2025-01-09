
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchRecommendations, addToWatchlist, fetchRatedMovies } from "../api";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
// import { title } from "process";

function Recommendations({ movies = [] }) {
  const genres = ["All", "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi",  "Thriller", "War", "Western"];
  const [selectedGenres, setSelectedGenres] = useState("All");
  const [ratings, setRatings] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const options = movies.map((movie) => ({ value: movie, label: movie }));

  useEffect(() => {
    const storedRecommendations = localStorage.getItem("recommendedMovies");
    if (storedRecommendations) {
      try {
        const parsedRecommendations = JSON.parse(storedRecommendations);
        if (Array.isArray(parsedRecommendations)) {
          setRecommendations(parsedRecommendations);
        //   const filteredMovies = selectedGenres === "All" ? parsedRecommendations : parsedRecommendations.filter((movie) => movie[1].includes(selectedGenres));
        //   console.log("selectedGenres", selectedGenres)
          //console.log(parsedRecommendations.filter((movie) => movie[1].includes(selectedGenres)))
        //   setRecommendations(filteredMovies);

        }
      } catch (error) {
        console.error("Error parsing recommendations from localStorage:", error);
      }
    }
  }, []);

//   const handleRatingChange = (movie, rating) => {
//     setRatings({ ...ratings, [movie]: rating });
//   };
const handleFilterChange = (genre) => {
    setSelectedGenres(genre);
    const storedRecommendations = localStorage.getItem("recommendedMovies");
    if (storedRecommendations) {
        try {
            const parsedRecommendations = JSON.parse(storedRecommendations);
            if (Array.isArray(parsedRecommendations)) {
                const filteredMovies = genre === "All" ? parsedRecommendations : parsedRecommendations.filter((movie) => movie[1].includes(genre));
                setRecommendations(filteredMovies);
            }
        } catch (error) {
            console.error("Error parsing recommendations from localStorage:", error);
        }
    }
};

const handleRatingChange = (movie, rating) => {
    setSelectedMovies({ ...selectedMovies, [movie]: rating });
    setRatings({ ...ratings, [movie]: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // console.log(selectedMovies)
    try {   
      const token = localStorage.getItem("token");
      const response = await fetchRecommendations(selectedMovies, token);
      let recommendedMovies = response.data;
      let moviestorecommend = []
    //   console.log("recommendedMovies", recommendedMovies)
      for (let i = 0; i < recommendedMovies.length; i++) {
        moviestorecommend[i] = [recommendedMovies[i][0], recommendedMovies[i][1]]
      }

      localStorage.setItem("recommendedMovies", JSON.stringify(moviestorecommend));
    //   console.log("moviestorecommend", moviestorecommend)
      setRecommendations(moviestorecommend || []);
      setActiveTab(1);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please log in to get recommendations.");
        } else {
      setError("Error fetching recommendations. Please try again.");}
      console.error(err);
    } finally {
      setLoading(false);
     
    }
  };

  const handleAddToWatchlist = async (movie) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      await addToWatchlist(movie, token);
      alert(`"${movie}" added to your watchlist!`);
    } catch (err) {
      setError(`Error adding "${movie}" to watchlist. Please try again.`);
      console.error(err);
    }
  };

  const handleFetchRatedMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetchRatedMovies(token);
      const userRatings = response.data;
  
      // Format past ratings
      const formattedRatings = {};
      userRatings.forEach(({ movie_title, rating }) => {
        formattedRatings[movie_title] = rating;
      });
  
      // Update ratings state
      setRatings((prevRatings) => ({
        ...prevRatings,
        ...formattedRatings,
      }));

      setSelectedMovies((prevMovies) => ({
        ...prevMovies,
        ...formattedRatings,
        }));
  
      // Extract movie titles and update selectedMovies
    //   const pastMovieTitles = userRatings.map(({ movie_title }) => movie_title);
    //   setSelectedMovies((prevMovies) => [
    //     ...new Set([...prevMovies, ...pastMovieTitles]),
    //   ]);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Please log in to view your past ratings.");
      }
      else{
      setError("Error fetching rated movies. Please try again.");}
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

//   const handleDeleteRating = (movie) => {
//     const newRatings = { ...ratings };
//     delete newRatings[movie];
//     setRatings(newRatings);
//     const newSelectedMovies = selectedMovies.filter((selectedMovie) => selectedMovie !== movie);
//     setSelectedMovies(newSelectedMovies);
//   };

const handleDeleteRating = (movie) => {
    const updatedMovies = { ...selectedMovies };
    delete updatedMovies[movie];
    setSelectedMovies(updatedMovies);
  };

  const handleDeleteCurrent = (movie) => {
    const newSelectedMovies = selectedMovies.filter((selectedMovie) => selectedMovie !== movie);
    setSelectedMovies(newSelectedMovies);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Search & Rate Movies" />
        {/* <Tab label="My Ratings" /> */}
        <Tab label="Recommendations" />
      </Tabs>

      {activeTab === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Search and Rate Movies
          </Typography>
          <Select
            options={options}
            isMulti
            onChange={(selectedOptions) =>{
              const newSelectedMovies = {}
              selectedOptions.forEach((option) => {
                if(!(option.value in selectedMovies)){
                    newSelectedMovies[option.value] = null
                }
                else{
                    newSelectedMovies[option.value] = selectedMovies[option.value]
                }
                });
                setSelectedMovies({ ...selectedMovies, ...newSelectedMovies })
}}
            placeholder="Select movies..."
          />
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
  {Object.keys(selectedMovies).length > 0 ? (
    Object.keys(selectedMovies).map((movie) => (
      <Box key={movie} mb={2}>
        <Typography variant="h6">{movie}</Typography>
        <TextField
          fullWidth
          label={!ratings[movie] ? `Rate "${movie}" (0-5)` : ""}
          value={selectedMovies[movie] || ""}
          type="number"
          inputProps={{ min: 0, max: 5 }}
          onChange={(e) => handleRatingChange(movie, parseFloat(e.target.value))}
        />
        <Button onClick={() => handleDeleteRating(movie)}>Delete</Button>
      </Box>
    ))
  ) : (
    <Typography>Select movies to rate.</Typography>
  )}
  <Button onClick={handleFetchRatedMovies}>Use Past Ratings</Button>
  <Button onClick={() => setSelectedMovies({})}>Clear</Button>
  <Button
    type="submit"
    variant="contained"
    color="primary"
    disabled={loading || Object.keys(selectedMovies).length === 0}
    fullWidth
  >
    {loading ? "Loading..." : "Get Recommendations"}
  </Button>
</form>

          {/* <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            {selectedMovies.length > 0 ? (
              selectedMovies.map((movie) => (
                <Box key={movie} mb={2}>
                    <Typography variant="h6">{movie}</Typography>
                  <TextField
                    fullWidth
                    label={!ratings[movie] ? `Rate "${movie}" (0-5)` : ""}
                    value = {ratings[movie] || ""}
                    type="number"
                    inputProps={{ min: 0, max: 5 }}
                    onChange={(e) => handleRatingChange(movie, parseFloat(e.target.value))}
                  />
                  <Button  onClick={() => handleDeleteRating(movie)}> Delete </Button>
                </Box>
              ))
            ) : (
              <Typography>Select movies to rate.</Typography>
            )}
            <Button
                onClick = {handleFetchRatedMovies}
             > Use Past Ratings </Button> <Button onClick = {() => setSelectedMovies([])}> Clear </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || Object.keys(ratings).length === 0}
              fullWidth
            >
              {loading ? "Loading..." : "Get Recommendations"}
            </Button>
          </form> */}
        </Box>
      )}

      {/* {activeTab === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            My Ratings
          </Typography>
          <Button
            variant="outlined"
            onClick={handleFetchRatedMovies}
            sx={{ mb: 2 }}
          >
            Load My Past Ratings
          </Button>
          {Object.keys(ratings).length > 0 ? (
            <Grid container spacing={2}>
              {Object.entries(ratings).map(([movie, rating]) => (
                <Grid item xs={12} sm={6} md={4} key={movie}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6">{movie}</Typography>
                    <Typography>Rating: {rating}</Typography>
                    <Button
                      color="error"
                      onClick={() => handleDeleteRating(movie)}
                      size="small"
                      sx={{ marginTop: 1 }}
                    >
                      Delete Rating
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No ratings available.</Typography>
          )}
        </Box>
      )} */}

      {activeTab === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Recommendations
          </Typography>
          {genres.map((genre) => (
          <Button key = {genre}
                 onClick={() => handleFilterChange(genre)}
                 >{genre}</Button>))}
          {loading ? (
            <Typography>Loading recommendations...</Typography>
          ) : recommendations.length > 0 ? (
            <Grid container spacing={3}>
              {recommendations.map((movie, index) => (
                // console.log("movie", movie, "index", index),
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
                    <Typography variant="h6">{movie[0]}</Typography>
                    <Typography>{movie[1]}</Typography>
                    {/* <Typography>{movie[1]}</Typography> */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToWatchlist(movie)}
                      sx={{ marginTop: 2 }}
                    >
                      Add to Watchlist
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No recommendations yet.</Typography>
          )}
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default Recommendations;
