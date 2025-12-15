import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

export default function MovieSlider({
    title,
    movies,
    itemsPerPage = 3,
    type = "list",
    isLoading = false,
}) {
    const [startIndex, setStartIndex] = useState(0);

    if (isLoading) {
        return (
            <div className="mb-12">
                {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
                <div className="flex justify-center p-12 bg-muted/20 rounded-xl">
                    <Loader2 className="animate-spin w-8 h-8 opacity-50" />
                </div>
            </div>
        );
    }

    if (!movies || movies.length === 0) return null;

    const handleNext = () => {
        setStartIndex((prev) =>
            prev + itemsPerPage < movies.length ? prev + itemsPerPage : 0
        );
    };

    const handlePrev = () => {
        setStartIndex((prev) =>
            prev - itemsPerPage >= 0
                ? prev - itemsPerPage
                : Math.floor((movies.length - 1) / itemsPerPage) * itemsPerPage
        );
    };

    // Banner/Revenue Mode (Single Item)
    if (type === "banner") {
        // Top 5 Revenue (using Popular as proxy), 1 item at a time
        const currentMovie = movies[startIndex % movies.length];

        // Auto-slide effect for banner
        // Note: In real app, use useEffect with setInterval

        return (
            <div className="mb-12 relative w-full h-[500px] overflow-hidden rounded-xl shadow-2xl group border-2 border-primary/20">
                {/* Left Banner Nav */}
                <button
                    onClick={() => setStartIndex((p) => (p - 1 + movies.length) % movies.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Right Banner Nav */}
                <button
                    onClick={() => setStartIndex((p) => (p + 1) % movies.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hover:scale-110"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-yellow-500 text-black font-bold rounded-full text-xs shadow-lg uppercase tracking-wider">
                        Top Revenue
                    </span>
                </div>

                {/* Clickable Area */}
                <Link to={`/movie/${currentMovie.id}`} className="block w-full h-full relative cursor-pointer">
                    <div className="absolute inset-0">
                        <img
                            src={
                                currentMovie.poster_path?.startsWith("http")
                                    ? currentMovie.poster_path
                                    : `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`
                            }
                            alt={currentMovie.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 text-white pl-20">
                        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
                            {currentMovie.title}
                        </h2>
                        <p className="mb-4 text-gray-200 line-clamp-2 drop-shadow-md">
                            {currentMovie.overview}
                        </p>
                        <div className="inline-block px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition shadow-lg">
                            Watch Now
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    // Classic Slider (3 items per page default)
    const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">
                    {title}
                </h2>
            </div>

            <div className="relative group/slider">
                {/* Left Button */}
                <button
                    onClick={handlePrev}
                    className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity"
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
                    {visibleMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                    {visibleMovies.length < itemsPerPage && (
                        // Fillers if needed, or just leave empty space
                        <div className="hidden"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
