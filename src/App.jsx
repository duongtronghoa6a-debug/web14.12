import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                    <Header />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <div className="p-8 text-center">
                                        Home Page Coming Soon
                                    </div>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}
export default App;
