import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { storage } from "../firebase";

const NewRequest = () => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [refUrl, setRefUrl] = useState("");
    const [clientName, setClientName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [receiver, setReceiver] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [minPrice, setMinPrice] = useState();

    const [error, setError] = useState("");

    const db = getFirestore();
    const navigate = useNavigate();
    const colRef = collection(db, "individual-user-page");

    let { userId } = useParams();
    const requestor = UserAuth().user.displayName;
    // console.log(userId);

    getDocs(colRef).then((snapshot) => {
        let content = [];
        let userData = [];
        let uid = [];
        snapshot.docs.forEach((doc) => {
            uid.push({ uid: doc.id });
            content.push({ id: doc.data().userId });
            userData.push({ profilePic: doc.data().profilePicture, minPrice: doc.data().minPrice });

            console.log(userData);
            const temp = content.pop();
            const tempUser = userData.pop();
            const tempUid = uid.pop();

            if (temp.id === userId) {
                console.log(temp.id);
                setArtistName(userId);
                setReceiver(tempUid.uid);
                setMinPrice(tempUser.minPrice);
                setProfilePicture(tempUser.profilePic);
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
                        document.getElementById("loading").classList.add("p-4");
                        document.getElementById("loading").innerHTML = "your request is being processed, please hold...";
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
            <div className="mx-24 my-10">
                <div className="font-segoe">
                    <div className="text-white bg-warning mb-4 rounded-lg font-bold" id="loading"></div>
                    <div className="flex flex-row justify-between">
                        <div>
                            <div className="font-bold text-3xl">submit a new request!</div>
                            <div>provide information for your request here.</div>
                        </div>

                        <Link className="btn btn-outline" to="/discover/artists">
                            cancel
                        </Link>
                    </div>

                    <br />

                    <div className="flex flex-row">
                        <div className="card card-bordered min-w-[20%] max-w-[25%] max-h-[150px] mr-6 bg-primary text-white font-bold font-montserrat">
                            <figure className="h-[100px]">
                                <img className="h-12 w-12 flex justify-center object-cover rounded-full" src={profilePicture} alt="profile"></img>
                            </figure>
                            <div className="card-body flex items-center justify-center max-h-[50px] pt-2">{userId}</div>
                        </div>

                        <form className="flex flex-col min-w-[75%] max-w-[80%] pl-10">
                            <div className="flex flex-row pb-4">
                                <label className="basis-[20%]">Amount</label>
                                <input
                                    id="price"
                                    className="basis-[80%] border-b-2 border-black"
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    min={minPrice || "150000"}
                                    max="25000000"
                                    required
                                ></input>
                            </div>
                            <div className="flex flex-row pb-4">
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
                            <div className="flex flex-row pb-4">
                                <label className="basis-[20%]">Reference URL</label>
                                <input className="basis-[80%] border-b-2 border-black" onChange={(e) => setRefUrl(e.target.value)} type="text" required></input>
                            </div>
                            <div className="flex flex-row pb-4">
                                <label className="basis-[20%]">Client name</label>
                                <button
                                    id="anon"
                                    className="btn btn-outline mr-4"
                                    onClick={() => {
                                        window.addEventListener("click", (e) => e.preventDefault());
                                        setClientName("Anonymous");
                                        document.getElementById("user").classList.remove("btn-active");
                                        document.getElementById("anon").classList.add("btn-active");
                                    }}
                                >
                                    Anonymous
                                </button>
                                <button
                                    id="user"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        window.addEventListener("click", (e) => e.preventDefault());
                                        setClientName(requestor);
                                        document.getElementById("anon").classList.remove("btn-active");
                                        document.getElementById("user").classList.add("btn-active");
                                    }}
                                >
                                    {requestor}
                                </button>
                            </div>
                            <div id="error-validation"></div>
                            <div className="flex flex-row">
                                <div className="basis-[20%] flex-none">Important Notice</div>
                                <ul className=" list-decimal ml-4">
                                    <li>The artist and the client are prohibited from communicating or making contact outside of this platform.</li>
                                    <li>It is prohibited for client to specify and/or urge deadline.</li>
                                    <li>Note that the final product's copyright belong to the artist.</li>
                                    <li>
                                        Artist is not obliged to follow any instructions regarding character, composition, resolution, differentiation, file format, etc.
                                        imposed by the client
                                    </li>
                                    <li>Client cannot object regarding the quality of finished work.</li>
                                    <li>
                                        As a client, you may leave feedback for the artist after the product is delivered to you. You can do so via our in-app chat
                                        platform.
                                    </li>
                                    <li>
                                        By accepting this request, I agree to the <span className="cursor-pointer underline">terms and conditions</span> of Drawer.
                                    </li>
                                </ul>
                            </div>
                            <br />
                            <div className="flex items-center justify-center">
                                <button className="btn btn-primary btn-md" type="submit" onClick={() => handleSubmit()}>
                                    request!
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewRequest;
