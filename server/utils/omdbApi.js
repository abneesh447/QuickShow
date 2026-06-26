import axios from 'axios';

const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export const searchMovies = async (query) => {
  const { data } = await axios.get(OMDB_BASE_URL, {
    params: {
      apikey: process.env.OMDB_API_KEY,
      s: query,
      type: 'movie'
    }
  });
  
  if (data.Response === 'False') {
    return []; // Return empty array instead of throwing error if no movies found
  }
  
  return data.Search;
};

export const getMovieDetails = async (imdbID) => {
  const { data } = await axios.get(OMDB_BASE_URL, {
    params: {
      apikey: process.env.OMDB_API_KEY,
      i: imdbID,
      plot: 'full'
    }
  });

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Failed to get movie details from OMDb');
  }

  return data;
};
