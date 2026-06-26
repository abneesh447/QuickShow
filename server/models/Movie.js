import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // imdbID
    title: { type: String, required: true },
    overview: { type: String, required: true }, // mapped from Plot
    poster: { type: String, required: true }, // mapped from Poster
    release_date: { type: String, required: true }, // mapped from Released
    original_language: { type: String }, // mapped from Language
    genres: { type: String, required: true }, // mapped from Genre
    casts: { type: String, required: true }, // mapped from Actors
    imdbRating: { type: String, required: true },
    runtime: { type: String, required: true }, // mapped from Runtime
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
