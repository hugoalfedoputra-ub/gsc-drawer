import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryPage from "./DeliveryPage";
import Navbar from "./Navbar";

const Submission = () => {
    let { requestId } = useParams();
    console.log(requestId);

    const [message, setMessage] = useState([]);

    const db = getFirestore();

    let content = [];
    useEffect(() => {
        const q = query(collection(db, "user-request"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.id === requestId && doc.data().clName === "") {
                    content.push({ ...doc.data(), id: doc.id, clName: "Anonymous" });
                } else if (doc.id === requestId && doc.data().clName !== "") {
                    content.push({ ...doc.data(), id: doc.id });
                }
            });
            setMessage(content);
        });
        return () => unsub();
    }, []);
    console.log(message);

    const navigate = useNavigate();
    const openSubmissionPage = (input) => {
        navigate("/submission/" + input + "/upload");
    };

    const RequestSubmission = ({ response }) => {
        return (
            <>
                <div className="font-bold text-3xl pb-4">request detail</div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">request ID</div>
                    <div>{response.id}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">amount paid</div>
                    <div>{response.price}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">description</div>
                    <div>{response.desc}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">reference URL</div>
                    <div>{response.ref}</div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-[20%]">client name</div>
                    <div>{response.clName}</div>
                </div>
                <br />
                <button className="flex-none cursor-pointer">
                    <label htmlFor="deliver">
                        <div className="btn btn-primary">open submission!</div>
                    </label>
                </button>
            </>
        );
    };

    const ArtworkSubmission = () => {
        navigate("/submission/upload");
    };

    return (
        <>
            <input type="checkbox" id="deliver" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <DeliveryPage />
                </div>
            </div>
            <div className="mx-24 my-10">
                <Navbar />
                <div className="font-segoe border-2 border-black border-solid rounded-xl p-4 mt-4">
                    {requestId ? message && message.map((relevant) => <RequestSubmission key={relevant.id} response={relevant} />) : <ArtworkSubmission />}
                </div>
            </div>
        </>
    );
};

export default Submission;
