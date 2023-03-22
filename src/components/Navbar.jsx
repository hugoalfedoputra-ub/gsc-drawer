import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [accIsOpen, setAccIsOpen] = useState(false);

    const db = getFirestore();
    const auth = getAuth();

    const notifDivRef = useRef(null);
    const accDivRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            try {
                if (!notifDivRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            } catch (e) {
                console.log(e.message);
            }
        }
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notifDivRef]);

    useEffect(() => {
        function handleClickOutside(event) {
            try {
                if (!accDivRef.current.contains(event.target)) {
                    setAccIsOpen(false);
                }
            } catch (e) {
                console.log(e.message);
            }
        }
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [accDivRef]);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let userInfo = null;
            userInfo = (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data();
            console.log("loading...");
            try {
                document.getElementById("get-account").innerHTML = "<a href='/user/" + userInfo.userId.disnameId + "'>profile</a>";
            } catch (e) {
                console.log(e.message);
            }
        } else {
            console.log("userless");
        }
    });

    const Notification = ({ open }) => {
        if (!open) return null;
        return (
            <div ref={notifDivRef} className="border-b-2 border-solid border-black">
                <NotificationPanel />
            </div>
        );
    };

    const ProfileDropDown = ({ accOpen, children }) => {
        if (!accOpen) return <div></div>;
        return <div ref={accDivRef}>{children}</div>;
    };

    const { logout } = UserAuth();

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

    return (
        <div>
            <div className="flex flex-row">
                <div className="basis-[90%]">
                    <h1 className="text-3xl font-bold">
                        <Link to="/discover/artists">Drawer.</Link>
                    </h1>
                </div>

                <div className="flex flex-row basis-[10%] justify-between">
                    <button>
                        <Link to="/submission">(+)</Link>
                    </button>
                    <button
                        onClick={() => {
                            if (!isOpen) {
                                setIsOpen(true);
                            } else {
                                setIsOpen(false);
                            }
                        }}
                    >
                        ntf
                    </button>
                    <button
                        onClick={() => {
                            if (!accIsOpen) {
                                setAccIsOpen(true);
                            } else {
                                setAccIsOpen(false);
                            }
                        }}
                    >
                        acc
                    </button>
                </div>
            </div>
            <Notification open={isOpen} />
            <div>
                <ProfileDropDown accOpen={accIsOpen}>
                    <div className="border-b-2 border-black">
                        <ul>
                            <li id="get-account">loading...</li>
                            <li>
                                <Link to="/user/bowdry/transaction">transaction</Link>
                            </li>
                            <li>
                                <Link to="/account">settings</Link>
                            </li>
                            <li>
                                <button onClick={() => handleLogout()}>logout</button>
                            </li>
                        </ul>
                    </div>
                </ProfileDropDown>
            </div>
        </div>
    );
};

export default Navbar;
