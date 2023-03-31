const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Express on Vercel");
    console.log("hello on get request");
});
app.listen(5000 || process.env.PORT, () => {
    console.log("Running on port 5000.");
});

console.log("hello world");

const serviceAccount = {
    type: "service_account",
    project_id: "drawer-webapp",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: "firebase-adminsdk-hkovu@drawer-webapp.iam.gserviceaccount.com",
    client_id: "104624487036110398474",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hkovu%40drawer-webapp.iam.gserviceaccount.com",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    project_id: "drawer-webapp",
});

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const db = admin.firestore();
const colRef = db.collection("user-request");

colRef.onSnapshot((querySnapshot) => {
    querySnapshot.forEach(
        (doc) => {
            if (doc.data().status === "pending") {
                let priceInt = parseInt(doc.data().price);
                let parameter = {
                    transaction_details: {
                        order_id: doc.id,
                        gross_amount: priceInt,
                    },
                    credit_card: {
                        secure: true,
                    },
                };
                snap.createTransaction(parameter)
                    .then(async (transaction) => {
                        // transaction redirect url
                        let transactionRedirectUrl = transaction.redirect_url;
                        //console.log("transactionRedirectUrl:", transactionRedirectUrl);
                        const updateRef = db.collection("user-request").doc(doc.id);
                        await updateRef.update({ pyLink: transactionRedirectUrl, status: "paid-pending" });
                    })
                    .catch((e) => {
                        console.log("Error occured:", e.message);
                    });
            }
        },
        (error) => {
            console.log(error.message);
        }
    );
});

module.exports = app;
