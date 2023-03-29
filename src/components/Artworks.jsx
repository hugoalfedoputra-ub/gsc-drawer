import { collection, doc, getFirestore, limit, onSnapshot, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../firebase";

const Artworks = () => {
    // console.log(UserAuth());
    const db = getFirestore();
    const q = query(collection(db, "individual-user-page"), limit(100));
    const colRef = collection(db, "individual-user-page");

    const [artCard, setArtCard] = useState(new Map());

    const updateMap = (k, v) => {
        setArtCard(new Map(artCard.set(k, v)));
    };

    let content = [];
    let artworks = [];
    let profiles = [];
    let nonfoos = [];
    let allArtworks = [];

    useEffect(() => {
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                content.push({ artId: doc.data().artId });
                console.log(content);
            });
            onSnapshot(colRef, (userDatas) => {
                userDatas.forEach((doxx) => {
                    profiles.push({
                        id: doxx.id,
                        artId: doxx.data().artId[doxx.data().artId.length - Math.ceil(doxx.data().artId.length / 10)],
                        username: doxx.data().userId,
                        profilePic: doxx.data().profilePicture,
                    });
                });
                for (let i = 0; i < profiles.length; i++) {
                    if (profiles[i].artId !== "foo") {
                        nonfoos.push(profiles[i]);
                    }
                }
                for (let i = 0; i < nonfoos.length; i++) {
                    updateMap(nonfoos[i].id, { url: nonfoos[i].artId, user: nonfoos[i].username, pfp: nonfoos[i].profilePic });
                }
                console.log(nonfoos);
            });
            // for (let i = 0; i < content.length; i++) {
            //     artworks.push(content[i].artId);
            // }

            // for (let i = 0; i < artworks.length; i++) {
            //     for (let j = artworks[i].length - Math.ceil(artworks[i].length / 10); j < artworks[i].length; j++) {
            //         if (artworks[i][j] !== "foo") {
            //             allArtworks.push(artworks[i][j]);
            //             console.log(allArtworks);
            //         }
            //     }
            // }
            // for (let i = 0; i < allArtworks.length; i++) {
            //     let temp = [];
            //     temp = allArtworks[i].split("+", 2); // there will be an edge case where a user inputs "+" in their title

            //     const imageRef = ref(storage, "artwork/" + temp[0]);
            //     console.log(imageRef);
            //     getDownloadURL(imageRef)
            //         .then((url) => {
            //             updateMap(temp[0], { title: temp[1], artUrl: url });
            //         })
            //         .catch((error) => console.log(error.message));
            // }
        });
        return () => unsub();
    }, []);

    const ArtworkPanel = ({ response }) => {
        return (
            <>
                <div className="card rounded-none h-[300px] bg-base-100 font-segoe">
                    <figure>
                        <img className="object-fill h-[220px] " src={response.url} alt="" />
                    </figure>
                    <div className="card-body flex flex-row p-0">
                        <img className="mt-2 avatar h-10 w-10 object-cover rounded-full" src={response.pfp} alt="profile" />
                        <div className="mt-4">{response.user}</div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="font-segoe">
            <br />
            <div className="grid grid-cols-4 gap-4">
                {Array.from(artCard).map(([key, value]) => (
                    <ArtworkPanel key={key} response={value} />
                ))}
            </div>
        </div>
    );
};

export default Artworks;
