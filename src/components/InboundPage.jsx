import { collection, doc, getFirestore, onSnapshot, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

const InboundPage = () => {
    let { requestId } = useParams();
    console.log(requestId);

    const [message, setMessage] = useState([]);
    const [userId, setUserId] = useState();
    const navigate = useNavigate("");

    const db = getFirestore();

    let content = [];
    let userInfo = [];
    useEffect(() => {
        const q = query(collection(db, "user-request"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.id === requestId && doc.data().clName === "") {
                    content.push({ ...doc.data(), id: doc.id, clName: "Anonymous" });
                    userInfo.push({ artistName: doc.data().arName });
                } else if (doc.id === requestId && doc.data().clName !== "") {
                    content.push({ ...doc.data(), id: doc.id });
                    userInfo.push({ artistName: doc.data().arName });
                }
            });
            setMessage(content);
            setUserId(userInfo);
            console.log(userId[0].artistName);
        });
        return () => {
            unsub();
        };
    }, []);
    console.log(message);

    const handleAccept = async () => {
        console.log("accepting...");
        const updRef = doc(db, "user-request", `/${requestId}`);
        await updateDoc(updRef, {
            status: "accepted",
        });
        navigate("/user/" + userId[0].artistName + "/transaction");
    };
    const handleReject = async () => {
        console.log("rejecting...");
        const updRef = doc(db, "user-request", `/${requestId}`);
        await updateDoc(updRef, {
            status: "rejected",
        });
        navigate("/user/" + userId[0].artistName + "/transaction");
    };

    const ResponsePanel = ({ response }) => {
        return (
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <div className="basis-[20%]">Amount</div>
                    <div className="basis-[80%]">{response.price}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">Description</div>
                    <div className="basis-[80%]">{response.desc}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">Reference URL</div>
                    <div className="basis-[80%]">{response.ref}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">Client name</div>
                    <div className="basis-[80%]">{response.clName}</div>
                </div>
                Important notice handle here
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="font-bold text-3xl">new inbound request!</div>
            <div>hello</div>
            {message && message.map((relevant) => <ResponsePanel key={relevant.id} response={relevant} />)}
            <div className="flex flex-row">
                <button className="pr-4" type="submit" onClick={() => handleAccept()}>
                    accept
                </button>
                <button className="pr-4" type="submit" onClick={() => handleReject()}>
                    reject
                </button>
            </div>
        </>
    );
};

export default InboundPage;
