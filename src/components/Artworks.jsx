import { collection, getFirestore, limit, onSnapshot, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../firebase";

const Artworks = () => {
    // console.log(UserAuth());
    const db = getFirestore();
    const q = query(collection(db, "individual-user-page"), limit(100));

    const [artCard, setArtCard] = useState(new Map());

    const updateMap = (k, v) => {
        setArtCard(new Map(artCard.set(k, v)));
    };

    let content = [];
    let artworks = [];
    let allArtworks = [];

    useEffect(() => {
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                content.push({ artId: doc.data().artId });
            });
            for (let i = 0; i < content.length; i++) {
                artworks.push(content[i].artId);
            }
            for (let i = 0; i < artworks.length; i++) {
                for (let j = 0; j < artworks[i].length; j++) {
                    if (artworks[i][j] !== "foo") {
                        allArtworks.push(artworks[i][j]);
                    }
                }
            }
            for (let i = 0; i < allArtworks.length; i++) {
                let temp = [];
                temp = allArtworks[i].split("+", 2); // there will be an edge case where a user inputs "+" in their title

                const imageRef = ref(storage, "artwork/" + temp[0]);
                console.log(imageRef);
                getDownloadURL(imageRef)
                    .then((url) => {
                        updateMap(temp[0], { title: temp[1], artUrl: url });
                    })
                    .catch((error) => console.log(error.message));
            }

            // console.log(content);
            // console.log(artworks);
            // console.log(allArtworks);
        });
        return () => unsub();
    }, []);

    // artCard.forEach((key, value) => console.log(value));

    const ArtworkPanel = ({ response }) => {
        return (
            <>
                <div className="flex flex-col">
                    <div>
                        <div>{response.title ? response.title : "no_title"}</div>
                        <img className="h-12 w-12" src={response.artUrl} alt="" />
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <h1>hello artworks</h1>
            {Array.from(artCard).map(([key, value]) => (
                <ArtworkPanel key={key} response={value} />
            ))}
        </div>
    );
};

export default Artworks;
