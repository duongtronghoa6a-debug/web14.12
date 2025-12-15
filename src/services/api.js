const BASE_URL = "/api";
const APP_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjIzXzMxIiwicm9sZSI6InVzZXIiLCJhcGlfYWNjZXNzIjp0cnVlLCJpYXQiOjE3NjUzNjE3NjgsImV4cCI6MTc3MDU0NTc2OH0.O4I48nov3NLaKDSBhrPe9rKZtNs9q2Tkv4yK0uMthoo";

async function fetchClient(endpoint, options = {}) {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json",
        "x-app-token": APP_TOKEN,
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
}

// Helper: Normalize movie data to match TMDB standard used in app
const normalizeMovie = (movie) => {
    if (!movie) return movie;

    // Parse runtime "68 mins" -> 68
    let runtime = movie.runtime;
    if (typeof runtime === "string") {
        const match = runtime.match(/(\d+)/);
        if (match) runtime = parseInt(match[1], 10);
    }

    // Normalize Genres: ["Comedy"] -> [{ id: 'Comedy', name: 'Comedy' }]
    let genres = movie.genres;
    if (Array.isArray(genres) && typeof genres[0] === "string") {
        genres = genres.map((g, i) => ({ id: i, name: g }));
    }

    // Helper to validate image path
    const getValidImage = (path) => {
        if (!path || path === "string" || path.trim() === "") return null;
        return path;
    };

    // Normalize Credits from properties
    const cast = movie.actors
        ? movie.actors.map((a) => ({
            id: a.id,
            name: a.name,
            character: a.character || a.role, // role might be "Actor"
            profile_path: getValidImage(a.image),
        }))
        : [];

    const crew = movie.directors
        ? movie.directors.map((d) => ({
            id: d.id,
            name: d.name,
            job: "Director", // specific mapping
            profile_path: getValidImage(d.image),
        }))
        : [];

    const credits = { cast, crew };

    return {
        ...movie,
        id: movie.id,
        title: movie.title,
        poster_path:
            getValidImage(movie.image) || getValidImage(movie.poster_path),
        vote_average: movie.rate || movie.vote_average,
        vote_count: movie.vote_count || 0, // Fallback
        overview: movie.short_description || movie.plot_full || movie.overview,
        release_date: movie.year ? `${movie.year}-01-01` : movie.release_date,
        runtime: runtime,
        genres: genres,
        credits: credits, // Attach derived credits
        similar: movie.similar_movies
            ? { results: movie.similar_movies.map(normalizeMovie) }
            : undefined,
        reviews: movie.reviews
            ? {
                results: movie.reviews.map((r) => ({
                    ...r,
                    author: r.username,
                    created_at: r.date,
                    id: r.id || Math.random().toString(),
                })),
            }
            : undefined,
    };
};

// Helper: Normalize person data
const normalizePerson = (person) => {
    if (!person) return person;

    // Helper to validate image path (reusing logic if possible, or duplicate for safety scopes)
    const getValidImage = (path) => {
        if (!path || path === "string" || path.trim() === "") return null;
        return path;
    };

    return {
        ...person,
        name: person.name,
        profile_path:
            getValidImage(person.image) || getValidImage(person.profile_path),
        biography: person.summary || person.biography,
        birthday: person.birth_date || person.birthday,
        place_of_birth: person.place_of_birth, // Not in new spec but keep matching
        known_for: person.known_for ? person.known_for.map(normalizeMovie) : [],
    };
};

const normalizeReview = (review) => {
    return {
        ...review,
        author: review.username || review.author,
        created_at: review.date || review.created_at,
        rate: review.rate,
        id: review.id || Math.random().toString(),
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "API Request Failed");
    }
    const data = await response.json();

    // Helper to detect review object
    const isReview = (item) =>
        item &&
        (item.content !== undefined ||
            (item.username !== undefined && item.rate !== undefined));

    // Normalize lists (found in data.data or data.results)
    if (data.data && Array.isArray(data.data)) {
        if (data.data.length > 0 && isReview(data.data[0])) {
            data.results = data.data.map(normalizeReview);
        } else {
            data.results = data.data.map(normalizeMovie); // Standardize to .results
        }
    } else if (data.results && Array.isArray(data.results)) {
        if (data.results.length > 0 && isReview(data.results[0])) {
            data.results = data.results.map(normalizeReview);
        } else {
            data.results = data.results.map(normalizeMovie);
        }
    }
    // Normalize single objects if they look like movies
    else if (data && !data.data && !data.results) {
        // Check if it's a person detail
        if (
            data.birth_date ||
            data.summary ||
            (data.role && data.role.includes("Actor"))
        ) {
            return normalizePerson(data);
        }
        // Check if it's a movie
        if (
            data.image ||
            data.rate ||
            data.short_description ||
            data.plot_full ||
            data.title
        ) {
            return normalizeMovie(data);
        }
    }

    return data;
};

/**
 * Service for interacting with the Movies Info API.
 * Handles Authentication, Movie Data, and User Profile.
 */
export const api = {
    login: async (username, password) => {
        return fetchClient("/users/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
    },
    register: async (username, password, email, name) => {
        return fetchClient("/users/register", {
            method: "POST",
            body: JSON.stringify({ username, password, email, name }),
        });
    },
    getProfile: async () => {
        return fetchClient("/users/profile");
    },
    updateProfile: async (data) => {
        return fetchClient("/users/profile", {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },
    getMoviesPopular: async (page = 1, limit = 10) => {
        return fetchClient(`/movies/most-popular?page=${page}&limit=${limit}`);
    },
    getMoviesTopRated: async (page = 1, limit = 10) => {
        return fetchClient(`/movies/top-rated?page=${page}&limit=${limit}`);
    },
    getMovieDetail: async (id) => {
        return fetchClient(`/movies/${id}`);
    },
    getMovieCredits: async (id) => {
        return fetchClient(`/movies/${id}/credits`);
    },
    getMovieReviews: async (id, page = 1) => {
        return fetchClient(`/movies/${id}/reviews?page=${page}`);
    },
    getPersonDetail: async (id) => {
        return fetchClient(`/persons/${id}`);
    },
    getPersonCredits: async (id) => {
        return fetchClient(`/persons/${id}/movie_credits`);
    },
    searchMovies: async (query, page = 1) => {
        return fetchClient(
            `/movies/search?q=${encodeURIComponent(query)}&page=${page}`
        );
    },
    // Favorites API
    getFavorites: async () => {
        return fetchClient("/users/favorites");
    },
    addFavorite: async (movieId) => {
        return fetchClient(`/users/favorites/${movieId}`, {
            method: "POST",
        });
    },
    removeFavorite: async (movieId) => {
        return fetchClient(`/users/favorites/${movieId}`, {
            method: "DELETE",
        });
    },
};
