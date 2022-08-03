import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import {
  Alert,
  Box,
  Button,
  Container,
  createTheme,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const OMDB_API_BASE_URL = `http://www.omdbapi.com`;

  // Search bar content
  const [searchQuery, setSearchQuery] = useState<string>("");
  // API return results
  const [movies, setMovies] = useState<undefined | any>([]);
  // Message to display for errors
  const [message, setMessage] = useState<undefined | string>(undefined);

  // Adjust global margin/padding factor
  const theme = createTheme({
    spacing: (factor: number) => `${0.25 * factor}rem`,
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container sx={{ my: 3 }}>
          <Typography variant="h2" sx={{ my: 3 }}>
            Movie Search
          </Typography>
          <TextField
            value={searchQuery}
            onChange={(event: any) => {
              setSearchQuery(event.target.value);
            }}
            label="Search for movie"
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ mr: 2, mb: 3 }}
          />
          <Button variant="contained" onClick={search}>
            Search
          </Button>
          {message !== "" && message !== undefined ? (
            <Alert severity="error">{message}</Alert>
          ) : null}
          {movies.map((movie: any) => (
            <Box
              sx={{
                border: "1px solid black",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                px: 3,
                py: 3,
                mt: 3,
                mx: "auto",
                width: "60%",
              }}
              key={movie.imdbID}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: "1",
                }}
              >
                <Box
                  textAlign="left"
                  className="movie-text-box"
                  sx={{
                    mr: 3,
                  }}
                >
                  <Link
                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                    variant="h6"
                    target="_blank"
                    rel="noopener"
                  >
                    <strong>{movie.Title}</strong>
                  </Link>
                  <Typography variant="subtitle1">
                    <strong>Year:</strong> {movie.Year}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Director:</strong> {movie.Director}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Rated:</strong> {movie.Rated}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Box Office:</strong> {movie.BoxOffice}
                  </Typography>
                </Box>

                <Box textAlign="left" className="movie-text-box">
                  <Typography variant="subtitle1">
                    <strong>Genre:</strong> {movie.Genre}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Runtime:</strong> {movie.Runtime}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Ratings:</strong>
                  </Typography>
                  {movie.Ratings != null
                    ? movie.Ratings.map((rating: any) => (
                        <Typography key={rating.Source} variant="subtitle1">
                          {rating.Source}: {rating.Value}
                        </Typography>
                      ))
                    : null}
                </Box>
              </Box>
              <Box
                component="img"
                sx={{
                  maxHeight: 200,
                  maxWidth: 250,
                }}
                alt={`${movie.Title} poster`}
                src={movie.Poster}
              />
            </Box>
          ))}
        </Container>
      </ThemeProvider>
    </div>
  );

  function search() {
    axios
      .get(OMDB_API_BASE_URL, {
        params: {
          apikey: API_KEY,
          s: searchQuery, // Search returns undetailed search data
          type: "movie",
        },
      })
      .then((response) => {
        // Display error message
        if (response.data.Response === "False") {
          showMessage(response.data.Error);
          return;
        }
        let movieInfo = response.data.Search;

        // Additional requests to get detailed movie data by imdbID
        movieInfo = Promise.all(
          movieInfo.map((movie: any) => {
            return axios
              .get(OMDB_API_BASE_URL, {
                params: {
                  apikey: API_KEY,
                  i: movie.imdbID, // Search by ID
                },
              })
              .then((response) => {
                return response.data;
              });
          })
        ).then((movieInfo) => {
          setMovies(movieInfo);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Display alert message on screen for 5 seconds
   *
   * @param message
   */
  function showMessage(message: string) {
    setMessage(message);
    setTimeout(() => {
      setMessage(undefined);
    }, 5000);
  }
}

export default App;
