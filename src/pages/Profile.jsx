import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Heart } from "lucide-react";

export default function Profile() {
    const { user, logout } = useAuth();

    if (!user) return <div>Please login.</div>;

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="bg-card border rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center gap-2 mb-8"> {/* Changed to flex-col and items-center */}
                    <div className="flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-4 mx-auto">
                        <User className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className="text-muted-foreground">Member since {new Date().getFullYear()}</p>
                    <p className="text-sm text-muted-foreground">Email: {user.email || "N/A"}</p>
                    <div className="mt-4 flex gap-2 justify-center">
                        <span className="px-3 py-1 bg-accent rounded-full text-xs">Standard Plan</span>
                        <span className="px-3 py-1 bg-accent rounded-full text-xs">Verified</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link to="/favorites" className="flex items-center justify-between p-4 border rounded-md hover:bg-accent transition">
                        <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="font-medium">My Favorite Movies</span>
                        </div>
                        <span className="text-muted-foreground">&rarr;</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full mt-8 px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
