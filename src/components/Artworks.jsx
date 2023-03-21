import { getFirestore } from "firebase/firestore";
import React from "react";
import { UserAuth } from "../context/AuthContext";

const Artworks = () => {
    // console.log(UserAuth());
    const db = getFirestore();

    return (
        <div>
            <h1>hello artworks</h1>
        </div>
    );
};

export default Artworks;
