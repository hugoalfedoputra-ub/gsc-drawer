import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
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

    let usernameJoined = "";
    onSnapshot(collection(db, "individual-user-page"), (querySnapshot) => {
        const username = [];
        querySnapshot.forEach((doc) => {
            username.push(doc.data().userId.disnameId);
            usernameJoined = username.join().replaceAll(",", "");
        });
    });

    const handleSubmit = async () => {
        document.addEventListener("submit", (e) => e.preventDefault());
        const tempUsername = document.getElementById("input-2").value;

        if (!document.getElementById("input-1").checkValidity()) {
            document.getElementById("error-validation").innerHTML = "Invalid email input.";
        } else if (usernameJoined.includes(tempUsername)) {
            document.getElementById("error-validation").innerHTML = "Username is already taken.";
        } else if (!document.getElementById("input-3").checkValidity()) {
            document.getElementById("error-validation").innerHTML = "Password is too short (minimum of 8 characters).";
        } else {
            try {
                await createUser(disname, email, password);
                navigate("/discover/artworks");
            } catch (e) {
                setError(e.message);
                console.log(e.message);
            }
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
            <form onSubmit={() => handleSubmit()}>
                <div>
                    <label>email address</label>
                    <input id="input-1" onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-black" type="email" required></input>
                </div>
                <div>
                    <label>display name</label>
                    <input id="input-2" onChange={(e) => setDisname(e.target.value)} className="border-b-2 border-black" type="name" required></input>
                </div>
                <div>
                    <label>password</label>
                    <input id="input-3" onChange={(e) => setPassword(e.target.value)} className="border-b-2 border-black" type="password" minLength="8" required></input>
                </div>
                <button>sign up</button>
            </form>
            <div id="error-validation"></div>
        </div>
    );
};

export default Signup;
