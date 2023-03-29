import { getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { storage } from "../firebase";
import Navbar from "./Navbar";

const Account = () => {
    const { user, logout } = UserAuth();
    const [open, isOpen] = useState();
    const [checkOpen, setCheckOpen] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [minPrice, setMinPrice] = useState();

    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();

    let openRequestStatus = "";
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            openRequestStatus = await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest;
            setCheckOpen(openRequestStatus);
        } else {
            console.log("userless");
        }
    });

    const handleOpenRequest = async () => {
        window.addEventListener("click", (e) => {
            e.preventDefault();
        });
        // console.log(await (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data().openRequest);
        if (openRequestStatus === false) {
            const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
            await updateDoc(docRef, {
                openRequest: true,
            }).then(isOpen(true));
        } else if (openRequestStatus === true) {
            const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
            await updateDoc(docRef, {
                openRequest: false,
            }).then(isOpen(false));
        }
    };

    const RequestButton = ({ isItOpen }) => {
        if (isItOpen === true) {
            return (
                <button className="btn btn-outline font-segoe border-2 border-solid border-black" onClick={() => handleOpenRequest()}>
                    close request
                </button>
            );
        } else if (isItOpen === false) {
            return (
                <button className="btn btn-primary font-segoe border-2 border-solid border-black" onClick={() => handleOpenRequest()}>
                    open request
                </button>
            );
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
            console.log("you are logged out");
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleUploadProfilePicture = () => {
        window.addEventListener("submit", (e) => e.preventDefault());
        if (profilePicture != null) {
            const date = new Date();
            const imageRef = ref(storage, `profile-pic/${date.getTime()}`);
            uploadBytes(imageRef, profilePicture)
                .then(async () => {
                    const docRef = await doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
                    await getDownloadURL(imageRef).then(async (url) => {
                        await updateDoc(docRef, {
                            profilePicture: url,
                        });
                        console.log("success!");
                    });
                })
                .catch((error) => console.log(error.message))
                .then(setProfilePicture(null));
        }
    };

    const handleMinimumPrice = async (e) => {
        window.addEventListener("submit", (e) => e.preventDefault());
        const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
        if (minPrice != null) {
            await updateDoc(docRef, {
                minPrice: minPrice,
            }).then(setMinPrice(null));
        }
    };

    return (
        <div>
            <Navbar />
            <div className="fixed ml-4 bg-clip-border bg-white z-10">
                <h1 className="text-3xl font-bold font-segoe px-1">settings</h1>
            </div>
            <div className="font-segoe z-0">
                <div className="border-solid border-black border-2 rounded-3xl mt-5 p-6">
                    <div className="flex flex-row">
                        <p className="basis-[30%]">user email</p>
                        <p>{user && user.email}</p>
                    </div>
                    <div className="flex flex-row pb-2">
                        <p className="basis-[30%]">display name</p>
                        <p>{user && user.displayName}</p>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%] flex items-center">client requests</div>
                        <div>{<RequestButton isItOpen={checkOpen} />}</div>
                    </div>

                    <form
                        className="flex flex-col"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUploadProfilePicture();
                            handleMinimumPrice();
                        }}
                    >
                        <div className="flex flex-row py-2">
                            <label className="basis-[30%] ">minimum asking price</label>
                            <input
                                className="border-b-2 border-solid border-black"
                                type="number"
                                min="150000"
                                max="25000000"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setMinPrice(e.target.value);
                                }}
                            ></input>
                        </div>
                        <div className="flex flex-row">
                            <label className="basis-[30%] flex items-center">upload profile picture</label>
                            <input
                                onChange={(e) => {
                                    setProfilePicture(e.target.files[0]);
                                }}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                id="upload"
                                hidden
                            ></input>
                            <label for="upload" className="btn btn-primary border-2 border-solid border-black">
                                browse...
                            </label>
                        </div>
                        <br />
                        <div className="flex justify-end">
                            <button className="btn btn-primary font-segoe border-2 border-solid border-black">save settings!</button>
                        </div>
                    </form>
                </div>

                <br />
                <button className="btn btn-outline font-segoe border-2 border-solid border-black" onClick={() => handleLogout()}>
                    logout
                </button>
            </div>
        </div>
    );
};

export default Account;
