import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import MovieCard from "../components/movie/MovieCard";
import { Loader2 } from "lucide-react";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (query) {
            setLoading(true);
            // Simulate API call for now or use real basic search
            api.searchMovies(query, page)
                .then((data) => {
                    // Adapt API response structure
                    setMovies(data.results || []);
                    setTotalPages(data.total_pages || 1);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [query, page]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin w-10 h-10 text-primary" />
                </div>
            ) : (
                <>
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-muted-foreground">No results found for "{query}"</p>
                            <p className="text-sm text-muted-foreground mt-2">Try searching for a different movie title.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
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
