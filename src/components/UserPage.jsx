import { collection, getDocs, getFirestore } from "firebase/firestore";
import React from "react";
import { useParams } from "react-router-dom";

const UserPage = () => {
    let { userId } = useParams();
    console.log(userId);

    const db = getFirestore();
    const colRef = collection(db, "individual-user-page");

    getDocs(colRef).then((snapshot) => {
        let content = [];
        let uid = [];
        snapshot.docs.forEach((doc) => {
            uid.push({ uid: doc.id });
            content.push({ id: doc.data().userId });
            const temp = content.pop();
            const tempUid = uid.pop();
            if (temp.id.disnameId === userId) {
                console.log("hello");
                console.log(temp.id.disnameId);
                console.log(tempUid.uid);

                // inject straight to div via id because i cant think of any other way
                document.getElementById("content").innerHTML = temp.id.disnameId;
            }
        });
    });

    return (
        <>
            <div>hello user page</div>
            <div>hello, i am</div>
            <div id="content"></div>
        </>
    );
};

export default UserPage;
