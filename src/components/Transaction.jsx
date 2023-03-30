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
                <div className="flex flex-col border-2 border-solid border-black rounded-xl p-4">
                    <div className="flex flex-row">
                        <div className="basis-[30%]">date</div>
                        <div>{moment(resp.tStamp).format("DD/MM/YYYY")}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">request ID</div>
                        <div>{resp.id}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">artist name</div>
                        <div>{resp.arName}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">work status</div>
                        <div>{resp.status}</div>
                    </div>
                    <div className="flex flex-row pb-2">
                        <div className="basis-[30%]">amount paid</div>
                        <div>{resp.price}</div>
                    </div>
                    {resp.status.includes("progress") ? (
                        <div className="btn btn-disabled">none yet...</div>
                    ) : (
                        <label className="btn btn-primary">
                            <a href={resp.artUrl}>delivered!</a>
                        </label>
                    )}
                </div>
            </>
        );
    };

    const TransactionPanel = ({ response }) => {
        return (
            <>
                <div className="flex flex-col border-2 border-solid border-black rounded-xl p-4">
                    <div className="flex flex-row">
                        <div className="basis-[30%]">date</div>
                        <div>{moment(response.tStamp).format("DD/MM/YYYY")}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">request ID</div>
                        <div>{response.id}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">client</div>
                        <div>{response.clName}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="basis-[30%]">work status</div>
                        <div>{response.status}</div>
                    </div>
                    <div className="flex flex-row pb-2">
                        <div className="basis-[30%]">amount paid</div>
                        <div>{response.price}</div>
                    </div>

                    {response.status.includes("progress") ? (
                        <button className="btn btn-primary">
                            <Link to={"/submission/" + response.id}>deliver</Link>
                        </button>
                    ) : (
                        <a className="btn btn-outline" href={response.artUrl}>
                            delivered!
                        </a>
                    )}
                </div>
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
        <>
            <div className="mx-24 my-10">
                <Navbar />
                <div className="font-segoe">
                    <div className="font-bold text-3xl pt-1 pb-3">transaction</div>
                    <div className="grid grid-cols-2 gap-4">{message && message.map((relevant) => <TransactionPanel key={relevant.id} response={relevant} />)}</div>
                    <div className="grid grid-cols-2 gap-4 pt-5">{yourRequest && yourRequest.map((relevant) => <RequestPanel key={relevant.id} resp={relevant} />)}</div>
                </div>
            </div>
        </>
    );
};

export default Transaction;
