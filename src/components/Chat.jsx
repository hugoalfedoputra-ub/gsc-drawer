import React from "react";
import Navbar from "./Navbar";

const Chat = () => {
    return (
        <>
            <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
                <Navbar />
                <div className="flex flex-1 justify-center items-center ">
                    <div className="w-[60%] border-black border-solid border-2 p-4 rounded-3xl">
                        <p className="font-bold text-3xl pb-2">You have found a future feature!</p>
                        <p className="text-lg leading-6">
                            This feature will be a future development and is not available for this current iteration but it will be for future ones!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
