import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";
import MovieCard from "../components/movie/MovieCard";

export default function PersonDetail() {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            setLoading(true);
            try {
                const [personData, creditsData] = await Promise.all([
                    api.getPersonDetail(id),
                    api.getPersonCredits(id).catch(() => ({ cast: [] })),
                ]);
                setPerson(personData);
                // Sort credits by popularity or date, allow user to switch?
                // Requirement just says "list of movies".
                // Credits structure usually: { cast: [...], crew: [...] }
                setCredits(creditsData.cast || []);
            } catch (error) {
                console.error("Error fetching person:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerson();
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin" />
            </div>
        );
    if (!person)
        return <div className="text-center py-20">Person not found</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/4 max-w-[250px] mx-auto md:mx-0">
                    {person.profile_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                            alt={person.name}
                            className="w-full rounded-lg shadow-xl"
                        />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center rounded-lg">
                            No Image
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-4">
                    <h1 className="text-4xl font-bold">{person.name}</h1>
                    <div className="text-sm text-muted-foreground mt-2 flex flex-col gap-1">
                        {person.birthday && (
                            <span className="flex items-center gap-2">
                                <strong>Born:</strong>{" "}
                                {new Date(person.birthday).toLocaleDateString(
                                    undefined,
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                        )}
                        {person.place_of_birth && (
                            <span className="flex items-center gap-2">
                                <strong>Place:</strong> {person.place_of_birth}
                            </span>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Biography
                        </h3>
                        <p className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {person.biography || "No biography available."}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                    Known For
                </h2>
                {credits.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {credits
                                .slice(
                                    (page - 1) * itemsPerPage,
                                    page * itemsPerPage
                                )
                                .map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                        </div>

                        {credits.length > itemsPerPage && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-primary/10 rounded disabled:opacity-50 hover:bg-primary/20 transition"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium">
                                    Page {page} of{" "}
                                    {Math.ceil(credits.length / itemsPerPage)}
                                </span>
                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(
                                                Math.ceil(
                                                    credits.length /
                                                        itemsPerPage
                                                ),
                                                p + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        page ===
                                        Math.ceil(credits.length / itemsPerPage)
                                    }
                                    className="px-4 py-2 bg-primary/10 rounded disabled:opacity-50 hover:bg-primary/20 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">No movies found.</p>
                )}
            </div>
        </div>
    );
}
