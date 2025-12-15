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
                const [popularRes, topRatedRes] = await Promise.all([
                    api.getMoviesPopular(1),
                    api.getMoviesTopRated(1),
                ]);

                const popMovies = popularRes.results || [];
                const ratedMovies = topRatedRes.results || [];

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
