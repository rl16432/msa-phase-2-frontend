import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Box, Button, Container, createTheme, TextField, ThemeProvider, Typography } from "@mui/material";

function App() {

  const API_KEY = process.env.REACT_APP_API_KEY;
  const OMDB_API_BASE_URL = `http://www.omdbapi.com`;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [movies, setMovies] = useState<undefined | any>([]);

  const theme = createTheme({
    spacing: (factor: number) => `${0.25 * factor}rem`
  })

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
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={search}>Search</Button>
          <Typography variant="body1" sx={{}}>
            {searchQuery}
          </Typography>
        </Container>
      </ThemeProvider>
    </div>
  );

  function search() {
    axios
      .get(OMDB_API_BASE_URL,
        {
          params: {
            apikey: API_KEY,
            s: searchQuery
          }
        })
      .then((response) => {
        let movieInfo = response.data.Search

        movieInfo = Promise.all(movieInfo.map(
          (movie: any) => {
            return axios
              .get(OMDB_API_BASE_URL,
                {
                  params: {
                    apikey: API_KEY,
                    i: movie.imdbID
                  }
                }
              )
              .then(response => {
                return response.data
              })
          }
        )).then(movieInfo => {
          console.log(movieInfo)
          setMovies(movieInfo)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
}

export default App;
