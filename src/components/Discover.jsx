import React from "react";
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import Artists from "./Artists";
import Artworks from "./Artworks";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

const Discover = () => {
    return (
        <div>
            <Navbar />
            <Link to="/discover/artworks" className="pr-4">
                discover artworks
            </Link>
            <Link to="/discover/artists" className="pr-4">
                discover artists
            </Link>
            <Routes>
                <Route
                    path="/artworks"
                    element={
                        <ProtectedRoute>
                            <Artworks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/artists"
                    element={
                        <ProtectedRoute>
                            <Artists />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default Discover;
