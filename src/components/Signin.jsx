import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signin = () => {
    const { signIn } = UserAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        document.addEventListener("submit", (e) => e.preventDefault());
        setError("");
        try {
            await signIn(email, password);
            navigate("/discover/artworks");
        } catch (e) {
            setError(e.message);
            document.getElementById("error-validation").innerHTML = "Incorrect email or password submitted.";
            console.log(error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">hello</h1>
            <div>
                <div>
                    <h1>sign in to your account</h1>
                    <p>
                        dont have an account yet? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
                <form onSubmit={() => handleSubmit()}>
                    <div>
                        <label>email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-black" type="email" required></input>
                    </div>
                    <div>
                        <label>password</label>
                        <input onChange={(e) => setPassword(e.target.value)} className="border-b-2 border-black" type="password" required></input>
                    </div>
                    <Link to="/iforgor">forgot password?</Link>
                    <br />
                    <button>sign in</button>
                </form>
                <div id="error-validation"></div>
            </div>
        </div>
    );
};

export default Signin;
