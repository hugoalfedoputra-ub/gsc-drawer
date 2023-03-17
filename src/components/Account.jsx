import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
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

    const handleOpenRequest = async (e) => {
        e.preventDefault();
        const db = getFirestore();

        // console.log(await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest);
        const openRequestStatus = await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest;
        if (openRequestStatus === false) {
            const docRef = doc(db, "individual-user-page", getAuth().currentUser.uid);
            await updateDoc(docRef, {
                openRequest: true,
            }).then((document.getElementById("opreq").innerHTML = "close requests"));
        } else if (openRequestStatus === true) {
            const docRef = doc(db, "individual-user-page", getAuth().currentUser.uid);
            await updateDoc(docRef, {
                openRequest: false,
            }).then((document.getElementById("opreq").innerHTML = "open requests"));
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold">account</h1>
                <p>user email: {user && user.email} </p>
                <p>display name: {user && user.displayName}</p>
                <button id="opreq" onClick={handleOpenRequest}>
                    open requests
                </button>
                <br />
                <br />
                <button onClick={handleLogout}>logout</button>
            </div>
        </div>
    );
};

export default Account;
