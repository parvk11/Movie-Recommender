import axios from "axios";

const api = axios.create({
  baseURL: "https://54.91.211.65/", // Your FastAPI URL
});

// Updated login function
export const login = ({ username, password }) => {
  const headers = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams({
    grant_type: "password",
    username,
    password,
    scope: "",
    client_id: "",
    client_secret: "",
  });

  return api.post("/api/token", data, { headers });
};

export const register = (data) => {
    const { username, password } = data;
    const url = `/api/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    return api.post(url);
  };
  

export const fetchRecommendations = (ratings, token) =>
  api.post("/api/showmovies", ratings, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchRatedMovies = (token) =>
  api.get("/api/userprefernces", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchMovies = () => api.get("/api/movies");

export const deleteRating = (movie, token) =>
    api.delete(`/api/userprefernces/${movie}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const addToWatchlist = async (movie, token) => {
    try {
        // Wait for the API request to complete
        await api.post(`/api/watchlist/${encodeURIComponent(movie)}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        });
    } catch (err) {
        // Log the error if the request fails
        console.log('Error adding movie to watchlist:', err);
        throw err;  // Optionally, rethrow the error to be handled elsewhere
    }
    };
      
export const fetchWatchlist = (token) =>
    api.get("/api/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
    });
export const deleteWatchlist = (movie, token) =>
    api.delete(`/api/watchlist/${movie}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export default api;
