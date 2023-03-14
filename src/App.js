import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Account from "./components/Account";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Discover from "./components/Discover";
import Artists from "./components/Artists";
import Artworks from "./components/Artworks";

function App() {
    return (
        <div className="App mx-10 my-10 z-0">
            {/* there are margins ^^here^^, remove in further development */}
            <AuthContextProvider>
                <Routes>
                    <Route path="/" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/discover/*"
                        element={
                            <ProtectedRoute>
                                <Discover />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthContextProvider>
        </div>
    );
}

export default App;
