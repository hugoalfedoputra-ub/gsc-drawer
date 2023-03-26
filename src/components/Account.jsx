import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

const Account = () => {
    const { user, logout } = UserAuth();
    const [open, isOpen] = useState();
    const [checkOpen, setCheckOpen] = useState();

    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();

    let openRequestStatus = "";
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            openRequestStatus = await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest;
            setCheckOpen(openRequestStatus);
            console.log(openRequestStatus);
        } else {
            console.log("userless");
        }
    });

    const handleOpenRequest = async () => {
        window.addEventListener("click", (e) => {
            e.preventDefault();
        });
        // console.log(await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest);
        if (openRequestStatus === false) {
            const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
            await updateDoc(docRef, {
                openRequest: true,
            }).then(isOpen(true));
        } else if (openRequestStatus === true) {
            const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
            await updateDoc(docRef, {
                openRequest: false,
            }).then(isOpen(false));
        }
    };

    const RequestButton = ({ isItOpen }) => {
        if (isItOpen === true) {
            return <button onClick={() => handleOpenRequest()}>close request</button>;
        } else if (isItOpen === false) {
            return <button onClick={() => handleOpenRequest()}>open request</button>;
        }
    };

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
            <Navbar />
            <div>
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl font-bold">settings</h1>
                </div>
                <p>user email: {user && user.email} </p>
                <p>display name: {user && user.displayName}</p>
                <div>{<RequestButton isItOpen={checkOpen} />}</div>
                <br />
                <br />
                <button onClick={() => handleLogout()}>logout</button>
            </div>
        </div>
    );
};

export default Account;
