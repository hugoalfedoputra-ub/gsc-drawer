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
                    <div className="basis-[18%]">Amount</div>
                    <div className="basis-[80%]">{response.price}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[18%]">Description</div>
                    <div className="basis-[80%]">{response.desc}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[18%]">Reference URL</div>
                    <div className="basis-[80%]">{response.ref}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[18%]">Client name</div>
                    <div className="basis-[80%]">{response.clName}</div>
                </div>
                <div className="flex flex-row pt-3 pb-6">
                    <div className="basis-[18%] flex-none">Important Notice</div>
                    <ul className=" list-decimal ml-4">
                        <li>The artist and the client are prohibited from communicating or making contact outside of this platform.</li>
                        <li>It is prohibited for client to specify and/or urge deadline.</li>
                        <li>Note that the final product's copyright belong to the artist.</li>
                        <li>
                            Artist is not obliged to follow any instructions regarding character, composition, resolution, differentiation, file format, etc. imposed by
                            the client
                        </li>
                        <li>Client cannot object regarding the quality of finished work.</li>
                        <li>As a client, you may leave feedback for the artist after the product is delivered to you. You can do so via our in-app chat platform.</li>
                        <li>
                            By accepting this request, I agree to the <span className="cursor-pointer underline">terms and conditions</span> of Drawer.
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="mx-24 my-10">
                <Navbar />
                <div className="font-segoe border-2 border-solid border-black mt-2 p-4 rounded-xl">
                    <div className="font-bold text-3xl pb-3">new inbound request!</div>
                    {message && message.map((relevant) => <ResponsePanel key={relevant.id} response={relevant} />)}
                    <div className="flex flex-row justify-center">
                        <button className="btn btn-primary mr-4 px-10" type="submit" onClick={() => handleAccept()}>
                            accept
                        </button>
                        <button className="btn btn-warning px-10" type="submit" onClick={() => handleReject()}>
                            reject
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InboundPage;
