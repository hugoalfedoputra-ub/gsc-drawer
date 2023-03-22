import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const UserPage = () => {
    let { userId } = useParams();
    console.log(userId);

    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let userInfo = null;
            var i = 0;
            do {
                userInfo = (await getDoc(doc(db, "individual-user-page", getAuth().currentUser.uid))).data();
                console.log("loading...");
                i++;
                if (i > 2) {
                    break;
                }
            } while (userInfo != null);

            getDocs(colRef).then((snapshot) => {
                let content = [];
                let openRequest = [];
                let uid = [];
                snapshot.docs.forEach((doc) => {
                    uid.push({ uid: doc.id });
                    content.push({ id: doc.data().userId });
                    openRequest.push({ openRequest: doc.data().openRequest });
                    const temp = content.pop();
                    const tempUid = uid.pop();
                    const tempOpenRequest = openRequest.pop();
                    if (temp.id.disnameId === userId) {
                        // console.log("hello");
                        console.log(temp.id.disnameId);
                        // console.log(tempOpenRequest);
                        // console.log(tempUid.uid);
                        if (tempOpenRequest.openRequest === true && userInfo.userId.disnameId !== temp.id.disnameId) {
                            document.getElementById("check-request").innerHTML = '<button id="new-request">new request</button>';
                            var newRequestButton = document.getElementById("new-request");
                            newRequestButton.addEventListener("click", async () => {
                                console.log("making a new request...");
                                window.location.href = "/user/" + userId + "/new";
                            });
                        } else if (userInfo.userId.disnameId === temp.id.disnameId) {
                            document.getElementById("check-request").innerHTML = "this is you";
                        } else {
                            document.getElementById("check-request").innerHTML = "closed";
                        }
                        // inject straight to div via id because i cant think of any other way
                        document.getElementById("content").innerHTML = temp.id.disnameId;
                    }
                });
            });
        } else {
            console.log("userless");
        }
    });

    return (
        <>
            <Navbar />
            <div className="flex flex-row justify-between">
                <div id="content" className="text-3xl font-bold"></div>
            </div>
            <div className="flex flex-row">
                <div className="basis-[25%]" id="check-request"></div>
                <div className="basis-[75%]" id="make-new-request">
                    artworks go here
                </div>
            </div>
        </>
    );
};

export default UserPage;
