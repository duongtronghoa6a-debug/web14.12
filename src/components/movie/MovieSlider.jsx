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
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-yellow-500 text-black font-bold rounded-full text-xs shadow-lg uppercase tracking-wider">
                        Top Revenue
                    </span>
                </div>
                <div className="absolute inset-0">
                    <img
                        src={
                            currentMovie.poster_path?.startsWith("http")
                                ? currentMovie.poster_path
                                : `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`
                        }
                        alt={currentMovie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 text-white">
                    <h2 className="text-4xl font-bold mb-2">
                        {currentMovie.title}
                    </h2>
                    <p className="mb-4 text-gray-300 line-clamp-2">
                        {currentMovie.overview}
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to={`/movie/${currentMovie.id}`}
                            className="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            Watch Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
