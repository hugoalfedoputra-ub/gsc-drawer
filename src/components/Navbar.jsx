import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Artists, { getArtist } from "./Artists";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const db = getFirestore();

    const notificationRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
    });

    const Notification = ({ open, children }) => {
        if (!open) return <div ref={notificationRef}></div>;
        return <div ref={notificationRef}>{children}</div>;
    };

    // const getArtist = async () => {
    //     console.log(await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data());
    // };

    return (
        <div>
            <div className="flex flex-row">
                <div className="basis-[90%]">
                    <h1 className="text-3xl font-bold">discover endlessly</h1>
                </div>

                <div className="flex flex-row basis-[10%] justify-between">
                    <button>cht</button>
                    <button onClick={() => setIsOpen(true)}>ntf</button>
                    <button>
                        <Link to="/account">acc</Link>
                    </button>
                </div>
            </div>
            <div>
                <Notification open={isOpen} ref={notificationRef}>
                    <div className="border-2 border-black">new inbound request!</div>
                </Notification>
            </div>
            <Link to="/discover/artworks" className="pr-4" onClick={getArtist()}>
                discover artworks
            </Link>
            <Link to="/discover/artists" className="pr-4">
                discover artists
            </Link>
        </div>
    );
};

export default Navbar;
