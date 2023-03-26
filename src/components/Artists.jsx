import { collection, doc, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";

const Artists = () => {
    // this function below reloads the window once to alleviate issue where artist name cant be clicked
    // (previous fix was to require the user to refresh page themselves)
    window.onload = function () {
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload();
        }
    };

    window.onload();

    const [data, setData] = useState([]);

    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");
    const q = query(colRef, where("openRequest", "==", true), limit(20));

    const getArtist = useCallback(async () => {
        const querySnapshot = await getDocs(q);
        const userData = [];
        querySnapshot.forEach((doc) => {
            userData.push(doc.data().userId.disnameId);
            setData(userData);
            // console.log(data);
            // setData(doc.data().userId.disnameId);
            // console.log(doc.data());
        });
        console.log(userData);
    });

    const inject = () => {
        console.log("loading artists...");
        document.getElementById("artist-map").innerHTML =
            "<ul>" +
            data
                .map((data) => {
                    return '<a href="/user/' + data + '">' + data + "</a>";
                })
                .join(" ") +
            "</ul>";
    };

    useEffect(() => {
        getArtist();
    }, []);

    useEffect(() => {
        inject();
    }, [getArtist]);

    return (
        <div>
            <div>hello artists</div>
            <div id="artist-map"></div>
        </div>
    );
};

export default Artists;
