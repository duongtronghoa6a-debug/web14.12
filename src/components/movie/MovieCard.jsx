import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function MovieCard({ movie }) {
    // Placeholder image if none provided
    const posterPath = movie.poster_path
        ? movie.poster_path.startsWith("http")
            ? movie.poster_path
            : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/500x750?text=No+Image";

    return (
        <div className="group relative w-full rounded-lg overflow-hidden shadow-md bg-card transition-transform hover:scale-105 hover:shadow-xl duration-300">
            <Link to={`/movie/${movie.id}`}>
                <div className="aspect-[2/3] w-full overflow-hidden">
                    <img
                        src={posterPath}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-10"
                    />
                </div>

                {/* Hover Content */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    {/* Blurred Background Layer */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-sm brightness-50 scale-110"
                        style={{ backgroundImage: `url(${posterPath})` }}
                    />

                    {/* Content Layer */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-center z-10 scale-95 group-hover:scale-100 transition-transform duration-300">
                        <h3 className="text-white font-bold text-lg mb-2">
                            {movie.title}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-400 mb-2">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold">
                                {movie.vote_average?.toFixed(1)}
                            </span>
                            <span className="text-gray-400 text-xs ml-2">
                                | {movie.release_date?.split("-")[0]}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                            {movie.overview || "No overview available."}
                        </p>
                        <span
                            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-lg uppercase tracking-wider"
                            aria-label={`View details for ${movie.title}`}
                        >
                            View Details
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
