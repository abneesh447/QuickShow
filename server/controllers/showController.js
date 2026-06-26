import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/index.js';
import { searchMovies, getMovieDetails } from '../utils/omdbApi.js';

export const getNowPlayingMovies = async (req, res) => {
  try {
    // OMDb does not have a "now playing" endpoint. We perform a default search instead.
    const movies = await searchMovies('marvel');
    
    // Format to match what the frontend admin panel expects for adding shows
    const formattedMovies = movies.map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      poster_path: movie.Poster,
      release_date: movie.Year,
    }));

    res.json({ success: true, movies: formattedMovies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      const movieApiData = await getMovieDetails(movieId);

      const movieDetails = {
        _id: movieId, // imdbID
        title: movieApiData.Title,
        overview: movieApiData.Plot,
        poster: movieApiData.Poster,
        release_date: movieApiData.Released || movieApiData.Year,
        original_language: movieApiData.Language,
        genres: movieApiData.Genre,
        casts: movieApiData.Actors,
        imdbRating: movieApiData.imdbRating || "0",
        runtime: movieApiData.Runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date;
      if (!showDate || !show.time) return;

      const times = Array.isArray(show.time) ? show.time : [show.time];

      times.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    await inngest.send({
      name: 'app/show.added',
      data: {
        movieTitle: movie.title,
      },
    });

    res.json({ success: true, message: 'Show Added Successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });
    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id.toString() });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
