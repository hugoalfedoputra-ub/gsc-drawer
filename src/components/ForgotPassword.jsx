import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = () => {
        document.addEventListener("submit", (e) => e.preventDefault());
        sendPasswordResetEmail(auth, email).then(() => {
            alert("Please check your email for further instructions to reset your password.");
            navigate("/");
        });
    };
    return (
        <>
            <div className="mx-24 my-10">
                <h1 className="text-3xl font-bold font-montserrat">so you forgot your password?</h1>
                <div className="font-segoe">
                    <form onSubmit={() => handleResetPassword()}>
                        <div className="flex flex-row py-2">
                            <label className="basis-[20%]">email address</label>
                            <input onChange={(e) => setEmail(e.target.value)} className="border-b-2 border-black" type="email" required></input>
                        </div>
                        <button className="btn btn-primary">send reset password email</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
