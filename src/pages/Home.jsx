import { useEffect, useState } from "react";
import MovieSlider from "../components/movie/MovieSlider";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";

export default function Home() {
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [revenueMovies, setRevenueMovies] = useState([]); // Using popular as proxy
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pop1, pop2, pop3, rated1, rated2, rated3] = await Promise.all([
                    api.getMoviesPopular(1),
                    api.getMoviesPopular(2),
                    api.getMoviesPopular(3),
                    api.getMoviesTopRated(1),
                    api.getMoviesTopRated(2),
                    api.getMoviesTopRated(3),
                ]);

                // Combine results to hit ~30 items (12*3 = 36)
                const popMovies = [...(pop1.results || []), ...(pop2.results || []), ...(pop3.results || [])].slice(0, 30);
                const ratedMovies = [...(rated1.results || []), ...(rated2.results || []), ...(rated3.results || [])].slice(0, 30);

                setPopularMovies(popMovies); // 20 items usually
                setTopRatedMovies(ratedMovies); // 20 items usually

                // Use top 5 popular as revenue proxy per instructions if no revenue endpoint
                // Instructions: "lấy danh sách movie có doanh thu cao nhất thì các em sử dụng chính API lấy danh sách movie phổ biến nhé"
                setRevenueMovies(popMovies.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="pb-10">
            {/* Top 5 Revenue (Carousel/Banner Mode) */}
            <section>
                <h2 className="text-2xl font-bold mb-4 px-2">
                    Highest Revenue
                </h2>
                <MovieSlider
                    title=""
                    movies={revenueMovies}
                    type="banner"
                    itemsPerPage={1}
                />
            </section>

            {/* Most Popular (15-30 items, 3 per page) */}
            <section className="mb-8">
                <MovieSlider
                    title="Most Popular"
                    movies={popularMovies}
                    itemsPerPage={3}
                />
            </section>

            {/* Top Rated (15-30 items, 3 per page) */}
            <section className="mb-8">
                <MovieSlider
                    title="Top Rated"
                    movies={topRatedMovies}
                    itemsPerPage={3}
                />
            </section>
        </div>
    );
}
