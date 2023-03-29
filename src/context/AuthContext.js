import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("");

    const createUser = async (disname, email, password) => {
        const disnameId = disname.replaceAll(" ", "");
        const db = getFirestore();

        try {
            await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
                return setDoc(doc(db, "individual-user-page", cred.user.uid), {
                    userId: disnameId,
                    profilePicture:
                        "https://firebasestorage.googleapis.com/v0/b/drawer-webapp.appspot.com/o/profile-pic%2Fdefaultuserprofile.png?alt=media&token=e5a883c0-55e0-4007-b129-463d4ca6f32d",
                    artId: arrayUnion("foo"),
                    minPrice: 150000,
                    openRequest: false,
                });
            });
            await updateProfile(auth.currentUser, { displayName: disname }).catch((e) => {
                setError(e.message);
                console.log(error);
            });
        } catch (e) {
            setError(e.message);
            console.log(error);
        }

        console.log(createUser.id);
    };

    const signIn = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // console.log(currentUser);
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
