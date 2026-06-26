import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // If movie.genres is an array from the old TMDB, we display differently than OMDb's string
  const displayGenres = typeof movie.genres === 'string' 
    ? movie.genres.split(',').slice(0, 2).join(' | ') 
    : movie.genres?.map(g => g.name).slice(0, 2).join(' | ');

  return (
    <div
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66"
    >
      <img
        src={movie.poster}
        alt="Movie Poster"
        className="rounded-lg h-52 w-full object-cover object-center cursor-pointer"
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
      />
      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2 truncate">
        {movie.release_date} ~ {displayGenres} ~ {movie.runtime}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="size-4 text-primary fill-primary" />
          {movie.imdbRating || "0"}
        </p>
      </div>
    </div>
  );
};
export default MovieCard;
