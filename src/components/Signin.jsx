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
        <div className="hero min-h-screen font-segoe bg-primary">
            <div className="hero-content flex flex-row">
                <div className="w-[50vw] font-montserrat text-4xl text-white font-bold">Drawer.</div>
                <div className="w-[250px] bg-white p-6 rounded-xl">
                    <div className="flex flex-row justify-between">
                        <div className="font-bold text-2xl">log in</div>
                        <div className="flex items-center">
                            or&nbsp;
                            <Link to="/signup" className="underline">
                                register
                            </Link>
                        </div>
                    </div>
                    <br />
                    <div id="error-validation" className=""></div>
                    <form onSubmit={() => handleSubmit()} className="flex flex-col">
                        <div>
                            <label>email</label>
                            <br />
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-2 border-black w-[202px] rounded-lg px-2 py-1"
                                type="email"
                                required
                            ></input>
                        </div>
                        <div>
                            <label>password</label>
                            <br />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-2 border-black w-[202px] rounded-lg px-2 py-1"
                                type="password"
                                required
                            ></input>
                        </div>
                        <Link to="/iforgor" className="underline cursor-pointer">
                            forgot password?
                        </Link>
                        <br />

                        <div className="flex justify-end">
                            <button className="flex justify-end btn btn-primary">log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signin;
