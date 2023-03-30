import { collection, doc, getDocs, getFirestore, limit, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Artists = () => {
    // this function below reloads the window once to alleviate issue where artist name cant be clicked
    // (previous fix was to require the user to refresh page themselves)
    // window.onload = function () {
    //     if (!window.location.hash) {
    //         window.location = window.location + "#fresh";
    //         window.location.reload();
    //     }
    // };
    // window.onload();

    const [data, setData] = useState([]);

    const navigate = useNavigate();

    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");
    const q = query(colRef, where("openRequest", "==", true), limit(20));

    useEffect(() => {
        const unsub = onSnapshot(q, (querySnapshot) => {
            const userData = [];
            querySnapshot.forEach((doc) => {
                userData.push({ id: doc.id, userId: doc.data().userId, profilePic: doc.data().profilePicture });
                setData(userData);
            });
            console.log(userData);
        });
        return () => {
            unsub();
        };
    }, []);

    const ArtistPanel = ({ response }) => {
        return (
            <>
                <div className="card h-[140px] bg-primary text-white font-bold">
                    <figure className="h-[100px]">
                        <img src={response.profilePic} alt="profile" className=" avatar rounded-full object-cover h-12 w-12"></img>
                    </figure>
                    <div className="card-body p-0">
                        <div
                            className="hover:cursor-pointer flex items-center justify-center hover:bg-white hover:text-primary mx-4 rounded-lg transition-all ease-in-out"
                            onClick={() => navigate("/user/" + response.userId)}
                        >
                            @{response.userId}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <br />
            <div className="grid grid-cols-4 gap-4">{data && data.map((relevant) => <ArtistPanel key={relevant.id} response={relevant} />)}</div>
        </div>
    );
};

export default Artists;
