import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Account from "./components/Account";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Discover from "./components/Discover";
import UserPage from "./components/UserPage";
import NewRequest from "./components/NewRequest";
import InboundPage from "./components/InboundPage";
import Transaction from "./components/Transaction";
import Submission from "./components/Submission";
import SubmissionPage from "./components/SubmissionPage";

function App() {
    // midtrans querystring is driving me insane
    return (
        <div className="App mx-10 my-10 z-0">
            {/* there are margins ^^here^^, remove in further development */}
            <AuthContextProvider>
                <Routes>
                    <Route path="/" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/discover/*"
                        element={
                            <ProtectedRoute>
                                <Discover />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/:userId/"
                        element={
                            <ProtectedRoute>
                                <UserPage />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/user/:userId/new"
                        element={
                            <ProtectedRoute>
                                <NewRequest />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/user/:userId/transaction"
                        element={
                            <ProtectedRoute>
                                <Transaction />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/request/:requestId"
                        element={
                            <ProtectedRoute>
                                <InboundPage />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/submission"
                        element={
                            <ProtectedRoute>
                                <Submission />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/submission/:requestId"
                        element={
                            <ProtectedRoute>
                                <Submission />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/submission/upload"
                        element={
                            <ProtectedRoute>
                                <SubmissionPage />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/submission/:requestId/upload"
                        element={
                            <ProtectedRoute>
                                <SubmissionPage />
                            </ProtectedRoute>
                        }
                    ></Route>
                </Routes>
            </AuthContextProvider>
        </div>
    );
}

export default App;
