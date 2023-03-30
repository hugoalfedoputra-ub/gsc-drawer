import { collection, getFirestore, limit, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { UserAuth } from "../context/AuthContext";

const UserPage = () => {
    window.onload = function () {
        if (!window.location.hash) {
            window.location = window.location + "#fresh";
            window.location.reload();
        }
    };
    window.onload();

    let { userId } = useParams();

    const db = getFirestore();

    const [artCard, setArtCard] = useState(new Map());
    const q = query(collection(db, "individual-user-page"), limit(100));

    const updateMap = (k, v) => {
        setArtCard(new Map(artCard.set(k, v)));
    };

    let content = [];
    let artworks = [];

    console.log(UserAuth().user.displayName);
    const currentUser = UserAuth().user.displayName;
    // forces check before useEffect
    if (currentUser === userId) {
        document.getElementById("check-request").innerHTML = "this is you";
    }

    useEffect(() => {
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().userId === userId) {
                    content.push({ userId: doc.data().userId, openRequest: doc.data().openRequest });
                    if (doc.data().openRequest === true && currentUser !== userId) {
                        document.getElementById("check-request").innerHTML = '<button id="new-request">NEW REQUEST</button>';
                        var newRequestButton = document.getElementById("new-request");
                        newRequestButton.addEventListener("click", async () => {
                            console.log("making a new request...");
                            window.location.href = "/user/" + userId + "/new";
                        });
                    } else if (currentUser === userId) {
                        document.getElementById("check-request").innerHTML = "THIS IS YOU";
                    } else if (doc.data().openRequest === false) {
                        document.getElementById("check-request").innerHTML = "CLOSED";
                    }
                    // inject straight to div via id because i cant think of any other way
                    document.getElementById("content").innerHTML = userId;

                    artworks.push({ artId: doc.data().artId });
                    for (let i = 0; i < artworks[0].artId.length; i++) {
                        if (artworks[0].artId[i] !== "foo") {
                            updateMap(i, artworks[0].artId[i]);
                        }
                    }
                }
            });
        });
        return () => {
            unsub();
        };
    }, []);

    const PersonalArtworkPanel = ({ response }) => {
        return (
            <>
                <div className="card rounded-none h-[200px] bg-base-100 font-segoe">
                    <figure>
                        <img className="object-cover h-[200px] " src={response} alt="" />
                    </figure>
                </div>
            </>
        );
    };

    return (
        <>
            <div>
                <div className="mx-24 my-10">
                    <Navbar />
                    <div className="font-segoe">
                        <div className="flex flex-row justify-between">
                            <div id="content" className="text-3xl font-bold"></div>
                        </div>
                        <br />
                        <div className="flex flex-row">
                            <div className="basis-[15%] btn btn-primary cursor-default mr-8" id="check-request"></div>
                            <div className="basis-[85%]" id="make-new-request">
                                <div className="grid grid-cols-4 gap-4">
                                    {Array.from(artCard).map(([key, value]) => (
                                        <PersonalArtworkPanel key={key} response={value} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPage;
