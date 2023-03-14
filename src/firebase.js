// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB33XbnCacAxn4G_69O329bNbQAviWcNuw",
    authDomain: "drawer-webapp.firebaseapp.com",
    projectId: "drawer-webapp",
    storageBucket: "drawer-webapp.appspot.com",
    messagingSenderId: "1038545258018",
    appId: "1:1038545258018:web:7bad0438c0483aeb212c7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
