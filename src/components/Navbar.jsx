import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const notificationRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
    });

    const Notification = ({ open, children }) => {
        if (!open) return <div ref={notificationRef}></div>;
        return <div ref={notificationRef}>{children}</div>;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">discover endlessly</h1>
            <p>
                click <Link to="/account">here</Link> to go to your account.
            </p>
            <button onClick={() => setIsOpen(true)} className="pr-4">
                notification
            </button>
            <Link to="/discover/artworks" className="pr-4">
                discover artworks
            </Link>
            <Link to="/discover/artists" className="pr-4">
                discover artists
            </Link>

            <Notification open={isOpen} ref={notificationRef}>
                <div className="border-2 border-black">new inbound request!</div>
            </Notification>
        </div>
    );
};

export default Navbar;
