import { useState } from "react";
import { Star, User } from "lucide-react";

export default function ReviewList({ reviews }) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    if (!reviews || reviews.length === 0) {
        return (
            <p className="text-muted-foreground italic">
                No reviews yet for this movie.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {reviews
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((review) => (
                    <div
                        key={review.id}
                        className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold block text-sm">
                                        {review.author}
                                    </span>
                                    {review.rate && (
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs ml-1">
                                                {review.rate}/10
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm line-clamp-4 leading-relaxed text-gray-700 dark:text-gray-300">
                            {review.content}
                        </p>
                    </div>
                ))}

            {reviews.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-primary/10 rounded disabled:opacity-50 hover:bg-primary/20 transition"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium">
                        Page {page} of{" "}
                        {Math.ceil(reviews.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={() =>
                            setPage((p) =>
                                Math.min(
                                    Math.ceil(reviews.length / itemsPerPage),
                                    p + 1
                                )
                            )
                        }
                        disabled={
                            page === Math.ceil(reviews.length / itemsPerPage)
                        }
                        className="px-4 py-2 bg-primary/10 rounded disabled:opacity-50 hover:bg-primary/20 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
