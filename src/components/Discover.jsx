import React, { useEffect, useRef, useState } from "react";
import { Link, BrowserRouter, Route, Routes, useParams, useNavigate } from "react-router-dom";
import Artists from "./Artists";
import Artworks from "./Artworks";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

const Discover = () => {
    const isArtwork = useRef(true);
    const isArtist = useRef(false);

    const navigate = useNavigate();

    const handleUnderline = () => {
        let whereIs = document.location.pathname;
        console.log(whereIs);
        console.log(whereIs.includes("artworks"));
        console.log(whereIs.includes("artists"));
        if (isArtist.current === true) {
            document.getElementById("artist").classList.add("border-b-2");
            document.getElementById("artwork").classList.remove("border-b-2");
        }
        if (isArtwork.current === true) {
            document.getElementById("artwork").classList.add("border-b-2");
            document.getElementById("artist").classList.remove("border-b-2");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-row font-segoe">
                <div
                    id="artwork"
                    className="cursor-pointer mr-4"
                    onClick={() => {
                        isArtwork.current = true;
                        isArtist.current = false;
                        handleUnderline();
                        navigate("/discover/artworks");
                    }}
                >
                    discover artworks
                </div>
                <div
                    id="artist"
                    className="cursor-pointer mr-4"
                    onClick={() => {
                        isArtist.current = true;
                        isArtwork.current = false;
                        handleUnderline();
                        navigate("/discover/artists");
                    }}
                >
                    discover artists
                </div>
            </div>

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
