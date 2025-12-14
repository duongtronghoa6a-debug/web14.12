import { useState, useEffect } from "react";
import { Moon, Sun, Home, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="w-full flex justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
            <div className="w-full max-w-[1200px] flex flex-col shadow-sm">
                {/* Top Header Line */}
                <div className="flex items-center justify-between px-2 sm:px-4 py-2 mt-2">
                    <span className="font-mono text-sm font-bold text-primary">
                        MSSV: 23120127
                    </span>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        Movies Info
                    </h1>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <Link to="/profile" className="hover:underline">
                                    {user.username || "User"}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-xs text-red-500 hover:underline ml-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm hover:underline"
                            >
                                Login
                            </Link>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-accent transition-all duration-300 hover:rotate-12"
                            aria-label="Toggle Dark Mode"
                            title={
                                isDark
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"
                            }
                        >
                            {isDark ? (
                                <Moon className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            ) : (
                                <Sun className="w-5 h-5 text-orange-500 fill-orange-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navbar Line */}
                <nav className="flex items-center justify-between px-4 py-3 bg-secondary/30 mb-2 rounded-b-md">
                    <Link
                        to="/"
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                        title="Home"
                    >
                        <Home className="w-6 h-6" />
                    </Link>
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center flex-1 max-w-md mx-4 gap-2 relative"
                    >
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="flex-1 px-4 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary text-black dark:text-white bg-white dark:bg-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="absolute right-12 text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        )}
                        <button
                            type="submit"
                            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="w-8"></div>{" "}
                    {/* Spacer to balance layout if needed */}
                </nav>
            </div>
        </div>
    );
}
