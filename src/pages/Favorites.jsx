import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/movie/MovieCard";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Favorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        if (user) {
            const favs = JSON.parse(localStorage.getItem(`fav_${user.username}`)) || [];
            setFavorites(favs);
        }
    }, [user]);

    const removeFavorite = (movieId) => {
        const newFavorites = favorites.filter(m => m.id !== movieId);
        localStorage.setItem(`fav_${user.username}`, JSON.stringify(newFavorites));
        setFavorites(newFavorites);
        // In a real app, use a Toast here
        alert("Movie removed from favorites");
    };

    const paginatedFavorites = favorites.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(favorites.length / itemsPerPage);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2 rounded-xl">
                    <Trash2 className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-xl font-semibold">No favorites yet</h3>
                    <p className="text-muted-foreground mb-6">Start exploring movies and save them here!</p>
                    <Link to="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">Browse Movies</Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedFavorites.map((movie) => (
                            <div key={movie.id} className="relative group">
                                <MovieCard movie={movie} />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFavorite(movie.id);
                                    }}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"
                                    title="Remove from favorites"
                                >
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 border rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="py-2">Page {page} of {totalPages}</span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
