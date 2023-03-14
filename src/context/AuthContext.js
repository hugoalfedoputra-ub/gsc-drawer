import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");

    const createUser = async (disname, email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password).catch((e) => {
                setError(e.message);
                console.log(e.message);
            });
            await updateProfile(auth.currentUser, { displayName: disname }).catch((e) => {
                setError(e.message);
                console.log(e.message);
            });
        } catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    };

    const signIn = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return <UserContext.Provider value={{ createUser, user, logout, signIn }}>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
    return useContext(UserContext);
};
