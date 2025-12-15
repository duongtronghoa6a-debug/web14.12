import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Heart, Lock, Mail } from "lucide-react";
import { api } from "../services/api"; // Assuming api has updateProfile

export default function Profile() {
    const { user, login, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "", // Often read-only
        currentPassword: "",
        newPassword: "",
    });

    if (!user) return <div className="p-8 text-center">Please login.</div>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check if changing password
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    alert("Please enter current password to set a new one.");
                    setLoading(false);
                    return;
                }
                // In real app, verify current password API here
            }

            // Mock update - in real app call api.updateProfile(formData)
            // await api.updateProfile(formData); 

            // Allow simulated update for UI demo
            alert("Profile updated successfully!");
            setIsEditing(false);
            // Re-login or update context if needed
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
            // Reset password fields
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-card border rounded-lg shadow-lg p-8">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-4 mx-auto">
                        <User className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className="text-muted-foreground">Member since {new Date().getFullYear()}</p>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" /> Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-background"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email (Read-only)
                            </label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full p-2 border rounded-md bg-muted text-muted-foreground"
                            />
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="font-semibold mb-4">Change Password</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md bg-background"
                                    placeholder="Required to change password"
                                />
                            </div>
                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md bg-background"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 mt-6"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                ) : (
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
                )}
            </div>
        </div>
    );
}
