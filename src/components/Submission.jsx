import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
                <div className="font-bold text-3xl">request detail</div>
                <div>request ID</div>
                <div>{response.id}</div>
                <div>amount paid</div>
                <div>{response.price}</div>
                <div>description</div>
                <div>{response.desc}</div>
                <div>reference URL</div>
                <div>{response.ref}</div>
                <div>client name</div>
                <div>{response.clName}</div>
                <br />
                <div>submission</div>
                <button onClick={() => openSubmissionPage(requestId)}>open submission</button>
            </>
        );
    };

    const ArtworkSubmission = () => {
        navigate("/submission/upload");
    };

    return (
        <>
            <Navbar />
            {requestId ? message && message.map((relevant) => <RequestSubmission key={relevant.id} response={relevant} />) : <ArtworkSubmission />}
        </>
    );
};

export default Submission;
