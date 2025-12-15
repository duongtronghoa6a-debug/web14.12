import { Star, User } from "lucide-react";

export default function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <p className="text-muted-foreground italic">No reviews yet for this movie.</p>;
    }

    return (
        <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold block text-sm">{review.author}</span>
                                {review.rate && (
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs ml-1">{review.rate}/10</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p className="text-sm line-clamp-4 leading-relaxed text-gray-700 dark:text-gray-300">
                        {review.content}
                    </p>
                </div>
            ))}
        </div>
    );
}
