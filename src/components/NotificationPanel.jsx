import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collectionGroup, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useRef } from "react";

const NotificationPanel = () => {
    const db = getFirestore();
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

            const colRef = collectionGroup(db, "user-request");
            let content = [];
            getDocs(colRef).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    content.push({
                        id: doc.id,
                        clientId: doc.data().clId,
                        clientName: doc.data().clName,
                        description: doc.data().desc,
                        amount: doc.data().price,
                        receiverId: doc.data().rcvId,
                        referenceUrl: doc.data().ref,
                        qStatus: doc.data().status,
                    });
                });

                for (let i = 0; i < content.length; i++) {
                    if (content[i].receiverId === getAuth().currentUser.uid && content[i].qStatus === "paid-pending") {
                        console.log("inbound notification!!!");
                        document.getElementById("inbound-notif").innerHTML = "";
                        document.getElementById("inbound-notif").innerHTML +=
                            '<div class="">' +
                            "<div>" +
                            moment(parseInt(content[i].id.toString().substring(4))).format("DD-MM-YYYY") +
                            "</div>" +
                            "<div>new inbound request</div>" +
                            '<a class="btn btn-primary mb-2" href="/request/' +
                            content[i].id +
                            '">open</a>' +
                            "</div>";
                    }
                }
            });
        } else {
            console.log("userless");
        }
    });

    return <div id="inbound-notif">much empty...</div>;
};

export default NotificationPanel;
