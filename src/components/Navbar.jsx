import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import moment from "moment/moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { storage } from "../firebase";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [accIsOpen, setAccIsOpen] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    const db = getFirestore();
    const auth = getAuth();

    const notifDivRef = useRef(null);
    const accDivRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            try {
                if (notifDivRef.current != null) {
                    if (!notifDivRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
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
                if (accDivRef.current != null) {
                    if (!accDivRef.current.contains(event.target)) {
                        setAccIsOpen(false);
                    }
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
            setProfilePictureUrl(userInfo.profilePicture);
            // const imageRef = ref(storage, "profile-pic/" + userInfo.profilePicture);
            // getDownloadURL(imageRef)
            //     .then((url) => {
            //         setProfilePictureUrl(url);
            //     })
            //     .catch((error) => console.log(error.message));
            // console.log("loading...");
            try {
                if (document.getElementById("get-account").innerHTML !== null) {
                    document.getElementById("get-account").innerHTML = "<a href='/user/" + userInfo.userId + "'>profile</a>";
                }
            } catch (e) {
                window.addEventListener("click", (e) => e.preventDefault());
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
            <div className="flex">
                <div className="flex-auto w-[80%]">
                    <h1 className="text-3xl font-bold">
                        <Link to="/discover/artworks">Drawer.</Link>
                    </h1>
                </div>

                <div className="flex-none">
                    <div className="flex flex-row justify-between">
                        <button className="flex-none pl-6">
                            <Link to="/submission">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                            </Link>
                        </button>
                        <button className="flex-none pl-6">
                            <Link to="/chat">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                                </svg>
                            </Link>
                        </button>
                        <div className="dropdown dropdown-bottom dropdown-end pl-5 flex-none">
                            <label tabIndex={0} className="cursor-pointer">
                                <div className="pt-[0.6rem]">
                                    <svg
                                        className="w-[1.1rem] h-[1.1rem] bi bi-bell"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
                                    </svg>
                                </div>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 bg-base-100 rounded-box w-52 shadow-2xl">
                                <NotificationPanel />
                            </ul>
                        </div>
                        <div className="justify-end dropdown dropdown-bottom dropdown-end pl-5 flex-none">
                            <label tabIndex={0} className="cursor-pointer">
                                {profilePictureUrl ? (
                                    <img src={profilePictureUrl} className="w-[2.25rem] h-[2.25rem] aspect-auto object-cover rounded-full" alt="profile"></img>
                                ) : (
                                    <div className="cursor-pointer">acc</div>
                                )}
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 bg-base-100 rounded-box w-52 shadow-2xl">
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
                    </div>
                </div>
            </div>
            <Notification open={isOpen} />
        </div>
    );
};

export default Navbar;
