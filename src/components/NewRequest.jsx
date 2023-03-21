import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const NewRequest = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [refUrl, setRefUrl] = useState("");
    const [clientName, setClientName] = useState("");
    const [receiver, setReceiver] = useState("");

    const [error, setError] = useState("");

    const db = getFirestore();
    const navigate = useNavigate();
    const colRef = collection(db, "individual-user-page");

    let { userId } = useParams();
    console.log(userId);

    getDocs(colRef).then((snapshot) => {
        let content = [];

        let uid = [];
        snapshot.docs.forEach((doc) => {
            uid.push({ uid: doc.id });
            content.push({ id: doc.data().userId });

            const temp = content.pop();
            const tempUid = uid.pop();

            if (temp.id.disnameId === userId) {
                setReceiver(tempUid.uid);
            }
        });
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const date = new Date();
        const auth = getAuth();
        let userInfo = null;

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                var i = 0;
                do {
                    userInfo = getAuth().currentUser.uid;
                    console.log("loading...");
                    i++;
                    if (i > 2) {
                        break;
                    }
                } while (userInfo != null);
                try {
                    await setDoc(doc(db, "user-request", "req-" + date.getTime().toString()), {
                        price: amount,
                        desc: description,
                        ref: refUrl,
                        clName: clientName,
                        clId: userInfo,
                        rcvId: receiver,
                        status: "pending",
                        tStamp: date.getTime(),
                    });
                } catch (e) {
                    setError(e.message);
                    console.log(error);
                }
            } else {
                console.log("userless");
            }
        });

        console.log("request submitted!");
        navigate("/discover/artworks");
    };

    return (
        <>
            <Navbar />

            <div>hello new request</div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Amount</label>
                    <input className="basis-[80%] border-b-2 border-black" onChange={(e) => setAmount(e.target.value)} type="text"></input>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Description</label>
                    <textarea className="basis-[80%] border-b-2 border-black" onChange={(e) => setDescription(e.target.value)} type="text" rows="3" cols="40"></textarea>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Reference URL</label>
                    <input className="basis-[80%] border-b-2 border-black" onChange={(e) => setRefUrl(e.target.value)} type="text"></input>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Client name</label>
                    <input className="basis-[80%] border-b-2 border-black" onChange={(e) => setClientName(e.target.value)} type="text" defaultValue="Anonymous"></input>
                </div>
                Important notice handle here
                <button type="submit" onClick={handleSubmit()}>
                    request artwork
                </button>
            </form>
        </>
    );
};

export default NewRequest;
