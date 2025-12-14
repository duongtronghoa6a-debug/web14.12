import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("accessToken"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Verify token/Fetch user
            api.getProfile()
                .then((userData) => setUser(userData))
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const data = await api.login(username, password);
        console.log("Login Login response:", data); // Debugging

        // Check for various token keys
        const token = data.accessToken || data.access_token || data.token;

        if (token) {
            setToken(token);
            localStorage.setItem("accessToken", token);
            // User data might come with login or need separate fetch
            if (data.user) setUser(data.user);
            else {
                try {
                    const userProfile = await api.getProfile();
                    setUser(userProfile);
                } catch (e) {
                    console.error("Failed to fetch profile after login", e);
                }
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
