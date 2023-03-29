import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { storage } from "../firebase";

const SubmissionPage = () => {
    let { requestId } = useParams();

    const [imageUpload, setImageUpload] = useState(null);
    const [title, setTitle] = useState("");

    const db = getFirestore();
    const navigate = useNavigate();
    const getUser = UserAuth();

    const handleSubmission = () => {
        document.addEventListener("submit", (e) => {
            e.preventDefault();
        });
        if (imageUpload != null) {
            const date = new Date();
            const imageRef = ref(storage, `artwork/${date.getTime()}`);
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
                        .catch((error) => console.log(error.message));
                })
                .catch((error) => console.log(error.message))
                .then(setImageUpload(null))
                .then(setTitle(""))
                .then(navigate("/discover/artworks"));
        }
    };

    return (
        <>
            <Link to="/discover/artists">ret</Link>
            <form>
                <label>image input</label>
                <input type="file" accept="image/png, image/jpg, image/jpeg, image/svg" onChange={(e) => setImageUpload(e.target.files[0])}></input>
                <label>title input</label>
                <input
                    type="text"
                    placeholder="artwork title"
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                ></input>
                <button onClick={() => handleSubmission()}>upload artwork</button>
            </form>
        </>
    );
};

export default SubmissionPage;
