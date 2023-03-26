import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, limit, onSnapshot, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { UserAuth } from "../context/AuthContext";

const UserPage = () => {
    let { userId } = useParams();

    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");

    const [artCard, setArtCard] = useState(new Map());
    const q = query(collection(db, "individual-user-page"), limit(100));

    const updateMap = (k, v) => {
        setArtCard(new Map(artCard.set(k, v)));
    };

    let content = [];
    let artworks = [];
    let allArtworks = [];

    console.log(UserAuth().user.displayName);
    const currentUser = UserAuth().user.displayName;
    // forces check before useEffect
    if (currentUser === userId) {
        document.getElementById("check-request").innerHTML = "this is you";
    }

    useEffect(() => {
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().userId.disnameId === userId) {
                    content.push({ artId: doc.data().artId, userId: doc.data().userId, openRequest: doc.data().openRequest });
                    if (doc.data().openRequest === true && currentUser !== userId) {
                        document.getElementById("check-request").innerHTML = '<button id="new-request">new request</button>';
                        var newRequestButton = document.getElementById("new-request");
                        newRequestButton.addEventListener("click", async () => {
                            console.log("making a new request...");
                            window.location.href = "/user/" + userId + "/new";
                        });
                    } else if (currentUser === userId) {
                        document.getElementById("check-request").innerHTML = "this is you";
                    } else if (doc.data().openRequest === false) {
                        document.getElementById("check-request").innerHTML = "requests closed. come again soon!";
                    }
                    // inject straight to div via id because i cant think of any other way
                    document.getElementById("content").innerHTML = userId;
                }
                console.log(content);
                for (let i = 0; i < content.length; i++) {
                    artworks.push(content[i].artId);
                }
                for (let i = 0; i < artworks.length; i++) {
                    for (let j = 0; j < artworks[i].length; j++) {
                        if (artworks[i][j] !== "foo") {
                            allArtworks.push(artworks[i][j]);
                        }
                    }
                }
                for (let i = 0; i < allArtworks.length; i++) {
                    let temp = [];
                    temp = allArtworks[i].split("+", 2); // there will be an edge case where a user inputs "+" in their title

                    const imageRef = ref(storage, "artwork/" + temp[0]);
                    console.log(imageRef);
                    getDownloadURL(imageRef)
                        .then((url) => {
                            updateMap(temp[0], { title: temp[1], artUrl: url });
                        })
                        .catch((error) => console.log(error.message));
                }
            });
        });
        return () => {
            unsub();
        };
    }, []);

    const PersonalArtworkPanel = ({ response }) => {
        return (
            <>
                <div className="flex flex-col">
                    <div>
                        <div>{response.title ? response.title : "no_title"}</div>
                        <img className="h-12 w-12" src={response.artUrl} alt="" />
                    </div>
                </div>
            </>
        );
    };

    // const auth = getAuth();
    // onAuthStateChanged(auth, async (user) => {
    //     if (user) {
    //         let userInfo = (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data();
    //         await getDocs(colRef).then((snapshot) => {
    //             let content = [];
    //             let openRequest = [];
    //             snapshot.docs.forEach((doc) => {
    //                 content.push({ id: doc.data().userId });
    //                 openRequest.push({ openRequest: doc.data().openRequest });
    //                 const temp = content.pop();
    //                 const tempOpenRequest = openRequest.pop();
    //                 if (temp.id.disnameId === userId) {
    //                     if (tempOpenRequest.openRequest === true && userInfo.userId.disnameId !== temp.id.disnameId) {
    //                         document.getElementById("check-request").innerHTML = '<button id="new-request">new request</button>';
    //                         var newRequestButton = document.getElementById("new-request");
    //                         newRequestButton.addEventListener("click", async () => {
    //                             console.log("making a new request...");
    //                             window.location.href = "/user/" + userId + "/new";
    //                         });
    //                     } else if (userInfo.userId.disnameId === temp.id.disnameId) {
    //                         document.getElementById("check-request").innerHTML = "this is you";
    //                     } else {
    //                         document.getElementById("check-request").innerHTML = "closed";
    //                     }
    //                     // inject straight to div via id because i cant think of any other way
    //                     document.getElementById("content").innerHTML = temp.id.disnameId;
    //                 }
    //             });
    //         });
    //     } else {
    //         console.log("userless");
    //     }
    // });

    return (
        <>
            <Navbar />
            <div className="flex flex-row justify-between">
                <div id="content" className="text-3xl font-bold"></div>
            </div>
            <div className="flex flex-row">
                <div className="basis-[25%]" id="check-request"></div>
                <div className="basis-[75%]" id="make-new-request">
                    {Array.from(artCard).map(([key, value]) => (
                        <PersonalArtworkPanel key={key} response={value} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default UserPage;
