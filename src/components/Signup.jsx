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
            username.push(doc.data().userId);
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
                console.log(error);
            }
        }
    };

    return (
        <>
            <div className="bg-primary min-w-[30%] max-w-[35%] fixed min-h-screen">&nbsp;</div>
            <div className="hero min-h-screen font-segoe  px-16">
                <div className="hero-content flex-flex-row">
                    <div className="min-w-[32%] text-white font-montserrat text-4xl font-bold">Drawer.</div>
                    <div className="flex flex-col bg-white pr-0">
                        <div className="text-3xl font-bold">register</div>
                        <br />
                        <div id="error-validation"></div>
                        <form onSubmit={() => handleSubmit()}>
                            <div className="flex flex-row">
                                <label className="basis-[15%]">email address</label>
                                <input
                                    id="input-1"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-b-2 border-black min-w-[40%] max-w-[50%]"
                                    type="email"
                                    required
                                ></input>
                            </div>
                            <div className="flex flex-row">
                                <label className="basis-[15%]">display name</label>
                                <input
                                    id="input-2"
                                    onChange={(e) => setDisname(e.target.value)}
                                    className="border-b-2 border-black min-w-[40%] max-w-[50%]"
                                    type="name"
                                    required
                                ></input>
                            </div>
                            <div className="flex flex-row">
                                <label className="basis-[15%]">password</label>
                                <input
                                    id="input-3"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-b-2 border-black min-w-[40%] max-w-[50%]"
                                    type="password"
                                    minLength="8"
                                    required
                                ></input>
                            </div>
                            <br />
                            <br />
                            <div className="min-w-[35%] max-w-[50%]">
                                <p>
                                    By creating a Drawer account, I agree to Drawer's <span className="cursor-pointer underline">terms and conditions</span> and to
                                    create and maintain a safe, inclusive, and respectful online community.
                                </p>
                            </div>
                            <br />
                            <div className="flex justify-start">
                                <button className="flex justify-end btn btn-primary px-16">register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
