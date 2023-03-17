import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import React from "react";

export const getArtist = async () => {
    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");
    const q = query(colRef, where("openRequest", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });
};

const Artists = () => {
    return <div>hello artists</div>;
};

export default Artists;
