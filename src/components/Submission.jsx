import { collection, getFirestore, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

    const RequestSubmission = ({ response }) => {
        return (
            <>
                <div>this is where you submit requests</div>
                <div>{response.id}</div>
            </>
        );
    };

    const ArtworkSubmission = () => {
        return (
            <>
                <div>this is where you submit personal artworks</div>
            </>
        );
    };

    return (
        <>
            <Navbar />
            <div>hello from the submission page</div>
            {requestId ? message && message.map((relevant) => <RequestSubmission key={relevant.id} response={relevant} />) : <ArtworkSubmission />}
        </>
    );
};

export default Submission;
