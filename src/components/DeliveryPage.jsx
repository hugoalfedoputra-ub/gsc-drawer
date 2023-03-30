import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../firebase";

const DeliveryPage = () => {
    let { requestId } = useParams();

    const [imageUpload, setImageUpload] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const db = getFirestore();

    const navigate = useNavigate();

    const handleSubmission = () => {
        document.addEventListener("submit", (e) => {
            e.preventDefault();
        });
        if (imageUpload != null) {
            const date = new Date();
            const imageRef = ref(storage, `artwork/${date.getTime()}`);
            document.getElementById("loading").innerHTML = "please wait...";
            uploadBytes(imageRef, imageUpload)
                .catch((error) => console.log(error.message))
                .then(() => {
                    console.log("image uploading...");
                    getDownloadURL(imageRef)
                        .then(async (url) => {
                            if (requestId) {
                                const reqRef = doc(db, "user-request", `/${requestId}`);
                                await updateDoc(reqRef, {
                                    status: "delivered",
                                    artUrl: url,
                                });
                            } else {
                                const docRef = doc(db, "individual-user-page", `/${getAuth().currentUser.uid}`);
                                await updateDoc(docRef, {
                                    artId: arrayUnion(url),
                                });
                                console.log(url);
                            }
                        })
                        .then(setIsFinished(true))
                        .then(() => {
                            document.getElementById("loading").innerHTML = "";
                        })
                        .catch((error) => console.log(error.message));
                })
                .catch((error) => console.log(error.message))
                .then(setImageUpload(null));
        }
    };

    return (
        <>
            <form className="font-segoe m-4">
                <div className="font-bold text-xl">deliver artwork to your client!</div>
                <div className="mb-4" id="loading"></div>
                <div className="flex flex-row justify-between">
                    <input
                        id="upload"
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/svg"
                        onChange={(e) => setImageUpload(e.target.files[0])}
                        hidden
                    ></input>
                    <label for="upload" className="btn btn-primary border-2 border-solid border-black mb-4">
                        {imageUpload ? <span>artwork ready to upload!!!</span> : <span>browse...</span>}
                    </label>

                    <label className="btn btn-primary mb-4 modal-action mt-0" onClick={() => handleSubmission()}>
                        {isFinished ? (
                            <div onClick={() => navigate("/discover/artworks")} className="btn btn-primary">
                                i'm finished!
                            </div>
                        ) : (
                            <span>upload artwork</span>
                        )}
                    </label>
                </div>
                <div className="flex flex-row modal-action mt-0 justify-start">
                    <label
                        onClick={() => {
                            setImageUpload(null);
                            setIsFinished(false);
                        }}
                        className="btn btn-warning mr-2"
                    >
                        refresh
                    </label>
                    <label htmlFor="deliver" className="btn btn-outline">
                        nevermind
                    </label>
                </div>
            </form>
        </>
    );
};

export default DeliveryPage;
