import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const Transaction = () => {
    let { userId } = useParams();
    console.log(userId);

    const [message, setMessage] = useState([]);
    const [yourRequest, setYourRequest] = useState([]);

    const db = getFirestore();
    const auth = getAuth();

    let content = [];
    let request = [];
    useEffect(() => {
        const q = query(collection(db, "user-request"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().rcvId === auth.currentUser.uid && doc.data().clName === "" && doc.data().status.includes("ccept")) {
                    content.push({ ...doc.data(), id: doc.id, clName: "Anonymous", status: "In progress" });
                }
                if (doc.data().rcvId === auth.currentUser.uid && doc.data().clName !== "" && doc.data().status.includes("ccept")) {
                    content.push({ ...doc.data(), id: doc.id, status: "In progress" });
                }
                if (doc.data().rcvId === auth.currentUser.uid && doc.data().clName === "" && doc.data().status.includes("elivered")) {
                    content.push({ ...doc.data(), id: doc.id, clName: "Anonymous", status: doc.data().status });
                }
                if (doc.data().rcvId === auth.currentUser.uid && doc.data().clName !== "" && doc.data().status.includes("elivered")) {
                    content.push({ ...doc.data(), id: doc.i, status: doc.data().status });
                }
                if (doc.data().clId === auth.currentUser.uid && doc.data().status.includes("ccept")) {
                    request.push({ ...doc.data(), id: doc.id, arName: doc.data().arName, status: "In progress" });
                }
                if (doc.data().clId === auth.currentUser.uid && doc.data().status.includes("elivered")) {
                    request.push({ ...doc.data(), id: doc.id, arName: doc.data().arName, status: doc.data().status });
                }
            });
            setMessage(content);
            setYourRequest(request);
        });
        return () => unsub();
    }, []);
    console.log(message);

    // moment(parseInt(content[i].id.toString().substring(4))).format("DD-MM-YYYY")
    const RequestPanel = ({ resp }) => {
        return (
            <>
                <div className="border-t-2 border-solid border-black">date</div>
                <div>{moment(resp.tStamp).format("DD/MM/YYYY")}</div>
                <div>request ID</div>
                <div>{resp.id}</div>
                <div>artist name</div>
                <div>{resp.arName}</div>
                <div>work status</div>
                <div>{resp.status}</div>
                <div>amount paid</div>
                <div>{resp.price}</div>
                <div>finished artwork</div>
                {resp.status.includes("progress") ? (
                    <div>none yet...</div>
                ) : (
                    <a className="border-2 border-solid border-black rounded-lg p-1" href={resp.artUrl}>
                        delivered!
                    </a>
                )}
            </>
        );
    };

    const TransactionPanel = ({ response }) => {
        return (
            <>
                <div className="border-t-2 border-solid border-black">date</div>
                <div>{moment(response.tStamp).format("DD/MM/YYYY")}</div>
                <div>request ID</div>
                <div>{response.id}</div>
                <div>client</div>
                <div>{response.clName}</div>
                <div>work status</div>
                <div>{response.status}</div>
                <div>amount paid</div>
                <div>{response.price}</div>
                {response.status.includes("progress") ? (
                    <button className="border-2 border-solid border-black rounded-lg p-1">
                        <Link to={"/submission/" + response.id}>deliver</Link>
                    </button>
                ) : (
                    <a className="border-2 border-solid border-black rounded-lg p-1" href={response.artUrl}>
                        delivered!
                    </a>
                )}
            </>
        );
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
        } else {
            console.log("userless");
        }
    });

    return (
        <div>
            <Navbar />
            <div className="font-bold text-3xl">transaction</div>
            {message && message.map((relevant) => <TransactionPanel key={relevant.id} response={relevant} />)}
            {yourRequest && yourRequest.map((relevant) => <RequestPanel key={relevant.id} resp={relevant} />)}
        </div>
    );
};

export default Transaction;
