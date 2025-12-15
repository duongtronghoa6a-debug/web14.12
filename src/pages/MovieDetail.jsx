import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Loader2, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ReviewList from "../components/movie/ReviewList";

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // For favorites logic later
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Check if favorite
        if (user && movie) {
            const favs =
                JSON.parse(localStorage.getItem(`fav_${user.username}`)) || [];
            setIsFavorite(favs.some((f) => f.id === movie.id));
        }
    }, [user, movie]);

    const toggleFavorite = () => {
        if (!user) {
            alert("Please login to add to favorites");
            return;
        }
        const favs =
            JSON.parse(localStorage.getItem(`fav_${user.username}`)) || [];
        if (isFavorite) {
            const newFavs = favs.filter((f) => f.id !== movie.id);
            localStorage.setItem(
                `fav_${user.username}`,
                JSON.stringify(newFavs)
            );
            setIsFavorite(false);
        } else {
            const newFavs = [
                ...favs,
                {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    overview: movie.overview,
                    release_date: movie.release_date,
                },
            ];
            localStorage.setItem(
                `fav_${user.username}`,
                JSON.stringify(newFavs)
            );
            setIsFavorite(true);
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const [movieData, creditsData, reviewsData] = await Promise.all(
                    [
                        api.getMovieDetail(id),
                        api.getMovieCredits(id).catch(() => ({ cast: [] })), // Allow partial fail
                        api.getMovieReviews(id).catch(() => ({ results: [] })),
                    ]
                );
                setMovie(movieData);
                // Use fetched credits if available, otherwise use credits from movie details
                const finalCredits =
                    creditsData &&
                        creditsData.cast &&
                        creditsData.cast.length > 0
                        ? creditsData
                        : movieData.credits || { cast: [], crew: [] };
                setCredits(finalCredits);

                // Handle review structure (response.data or response array)
                const reviewsList =
                    reviewsData.results ||
                    reviewsData.data ||
                    reviewsData ||
                    [];
                setReviews(Array.isArray(reviewsList) ? reviewsList : []);
            } catch (error) {
                console.error("Error fetching detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin" />
            </div>
        );
    if (!movie) return <div className="text-center py-20">Movie not found</div>;

    const posterPath = movie.poster_path
        ? movie.poster_path.startsWith("http")
            ? movie.poster_path
            : `https://image.tmdb.org/t/p/original${movie.poster_path}`
        : "https://placehold.co/500x750?text=No+Image";

    return (
        <div>
            {/* Top Details Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/3 max-w-[300px] mx-auto md:mx-0">
                    <img
                        src={posterPath}
                        alt={movie.title}
                        className="w-full rounded-lg shadow-xl"
                    />
                </div>
                <div className="flex-1 space-y-4">
                    <h1 className="text-4xl font-bold">
                        {movie.title}{" "}
                        <span className="text-muted-foreground font-normal">
                            ({new Date(movie.release_date).getFullYear()})
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-accent rounded text-xs font-semibold">
                            {Math.floor(movie.runtime / 60)}h{" "}
                            {movie.runtime % 60}m
                        </span>
                        <div className="flex gap-2">
                            {movie.genres?.map((g) => (
                                <span
                                    key={g.id}
                                    className="px-2 py-1 border rounded hover:bg-primary/10 transition-colors cursor-default"
                                >
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-yellow-500">
                            ★ {movie.vote_average?.toFixed(1)}
                        </span>
                        <span className="text-sm">
                            ({movie.vote_count} votes)
                        </span>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Overview</h3>
                        <div
                            className="leading-relaxed text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: movie.overview }}
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Director</h3>
                        <p>
                            {credits?.crew?.find((c) => c.job === "Director")
                                ?.name || "Unknown"}
                        </p>
                    </div>

                    <button
                        onClick={toggleFavorite}
                        className={`px-6 py-2 rounded-full font-bold mt-4 transition ${isFavorite
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                    >
                        {isFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                    </button>
                </div>
            </div>

            {/* Cast Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                    Top Cast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {credits?.cast?.slice(0, 12).map((actor) => (
                        <Link
                            to={`/person/${actor.id}`}
                            key={actor.id}
                            className="group"
                        >
                            <div className="aspect-square rounded-full overflow-hidden mb-2 border hover:border-primary transition">
                                {actor.profile_path ? (
                                    <img
                                        src={
                                            actor.profile_path.startsWith(
                                                "http"
                                            )
                                                ? actor.profile_path
                                                : `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                        }
                                        alt={actor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-accent flex items-center justify-center">
                                        <User />
                                    </div>
                                )}
                            </div>
                            <p className="font-semibold text-center text-sm group-hover:text-primary">
                                {actor.name}
                            </p>
                            <p className="text-xs text-center text-muted-foreground">
                                {actor.character}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                    Reviews
                </h2>
                <ReviewList reviews={reviews} />
            </div>
        </div>
    );
}
