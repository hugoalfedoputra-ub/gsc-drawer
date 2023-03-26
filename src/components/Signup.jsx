import { getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disname, setDisname] = useState("");
    const [error, setError] = useState("");

    const { createUser } = UserAuth();

    const navigate = useNavigate();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createUser(disname, email, password);
            navigate("/discover/artworks");
        } catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">hello</h1>
            <div>
                <h1>sign up for a free account</h1>
                <p>
                    already have an account? <Link to="/">Sign in</Link>
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>email address</label>
                    <input onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-black" type="email"></input>
                </div>
                <div>
                    <label>display name</label>
                    <input onChange={(e) => setDisname(e.target.value)} className="border-b-2 border-black" type="name"></input>
                </div>
                <div>
                    <label>password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className="border-b-2 border-black" type="password"></input>
                </div>
                <button>sign up</button>
            </form>
        </div>
    );
};

export default Signup;
