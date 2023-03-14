import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Account = () => {
    const { user, logout } = UserAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
            console.log("you are logged out");
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold">account</h1>
                <p>user email: {user && user.email} </p>
                <p>display name: {user && user.displayName}</p>
                <button onClick={handleLogout}>logout</button>
            </div>
        </div>
    );
};

export default Account;
