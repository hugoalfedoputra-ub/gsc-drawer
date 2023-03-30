import { collection, getFirestore, limit, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Artworks = () => {
    // console.log(UserAuth());
    const db = getFirestore();
    const q = query(collection(db, "individual-user-page"), limit(100));
    const colRef = collection(db, "individual-user-page");

    const [artCard, setArtCard] = useState(new Map());

    const navigate = useNavigate();

    const updateMap = (k, v) => {
        setArtCard(new Map(artCard.set(k, v)));
    };

    let artworks = [];
    let profiles = [];

    useEffect(() => {
        const unsub = onSnapshot(colRef, (userDatas) => {
            userDatas.forEach((doxx) => {
                artworks.push({ artId: doxx.data().artId });
                profiles.push({
                    id: doxx.id,
                    artId: doxx.data().artId,
                    artLen: doxx.data().artId.length,
                    username: doxx.data().userId,
                    profilePic: doxx.data().profilePicture,
                });
            });

            for (let h = 0; h < profiles.length; h++) {
                let tempProfile = profiles[h];
                if (profiles[h].artLen > 1) {
                    console.log(tempProfile);
                    for (let i = tempProfile.artId.length - 1 - Math.ceil(tempProfile.artId.length / 2); i < tempProfile.artId.length; i++) {
                        if (tempProfile.artId[i] !== "foo") {
                            console.log(tempProfile.artId[i]);
                            updateMap(tempProfile.id + i.toString(), { url: tempProfile.artId[i], user: tempProfile.username, pfp: tempProfile.profilePic });
                        }
                    }
                }
            }
        });
        return () => unsub();
    }, []);

    const ArtworkPanel = ({ response }) => {
        return (
            <>
                <div className="card rounded-none h-[300px] bg-base-100 font-segoe">
                    <figure>
                        <img className="object-cover h-[220px] " src={response.url} alt="" />
                    </figure>
                    <div className="card-body flex flex-row p-0">
                        <img className="mt-5 avatar h-10 w-10 object-cover rounded-full" src={response.pfp} alt="profile" />
                        <div
                            className="font-montserrat font-bold cursor-pointer flex items-center justify-center hover:underline hover:bg-black transition-all ease-in-out bg-primary text-white my-6 px-2 rounded-lg"
                            onClick={() => navigate("/user/" + response.user)}
                        >
                            @{response.user}
                        </div>
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
