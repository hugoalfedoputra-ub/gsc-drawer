import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const NewRequest = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [refUrl, setRefUrl] = useState("");
    const [clientName, setClientName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [receiver, setReceiver] = useState("");

    const [error, setError] = useState("");

    const db = getFirestore();
    const navigate = useNavigate();
    const colRef = collection(db, "individual-user-page");

    let { userId } = useParams();
    // console.log(userId);

    getDocs(colRef).then((snapshot) => {
        let content = [];

        let uid = [];
        snapshot.docs.forEach((doc) => {
            uid.push({ uid: doc.id });
            content.push({ id: doc.data().userId });

            const temp = content.pop();
            const tempUid = uid.pop();

            if (temp.id.disnameId === userId) {
                setArtistName(userId);
                setReceiver(tempUid.uid);
            }
        });
    });

    const handleSubmit = async () => {
        window.addEventListener("click", (e) => e.preventDefault());
        setError("");

        const price = document.getElementById("price");
        if (!price.checkValidity()) {
            document.getElementById("error-validation").innerHTML = "Input an integer price between 150000 and 25000000.";
        } else {
            document.getElementById("error-validation").innerHTML = "";
            const date = new Date();
            const auth = getAuth();
            let userInfo = null;

            const timestampedReqId = "req-" + date.getTime().toString();
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
                        await setDoc(doc(db, "user-request", timestampedReqId), {
                            price: amount,
                            desc: description,
                            ref: refUrl,
                            clName: clientName,
                            arName: artistName,
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

            const docRef = doc(db, "user-request", timestampedReqId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("request submitted!");
                let linkie = "";
                onSnapshot(
                    docRef,
                    (querySnapshot) => {
                        console.log("loading...");
                        document.getElementById("loading").innerHTML = "loading...";
                        if (querySnapshot.data().status !== "pending") {
                            linkie = querySnapshot.data().pyLink;
                            console.log(linkie);
                            window.open(linkie);
                            const delay = (ms) => new Promise((res) => setTimeout(res, ms));
                            delay(2500);
                            navigate("/discover/artworks");
                        }
                    },
                    (error) => {
                        console.log(error.message);
                    }
                );
            }
        }
    };

    return (
        <>
            <div className="font-bold text-3xl" id="loading"></div>
            <Link to="/discover/artists">ret</Link>
            <div className="font-bold text-3xl">hello new request</div>
            <div>for user: {userId}</div>

            <form className="flex flex-col">
                <div className="flex flex-row">
                    <label className="basis-[20%]">Amount</label>
                    <input
                        id="price"
                        className="basis-[80%] border-b-2 border-black"
                        onChange={(e) => setAmount(e.target.value.replaceAll("[^1234567890]", ""))}
                        type="number"
                        min="150000"
                        max="25000000"
                        required
                    ></input>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Description</label>
                    <textarea
                        className="basis-[80%] border-b-2 border-black"
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        rows="3"
                        cols="40"
                        required
                    ></textarea>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Reference URL</label>
                    <input className="basis-[80%] border-b-2 border-black" onChange={(e) => setRefUrl(e.target.value)} type="text" required></input>
                </div>
                <div className="flex flex-row">
                    <label className="basis-[20%]">Client name</label>
                    <input
                        className="basis-[80%] border-b-2 border-black"
                        onChange={(e) => setClientName(e.target.value)}
                        type="text"
                        defaultValue="Anonymous"
                        required
                    ></input>
                </div>
                <div id="error-validation"></div>
                Important notice handle here
                <button type="submit" onClick={() => handleSubmit()}>
                    request artwork
                </button>
            </form>
        </>
    );
};

export default NewRequest;
