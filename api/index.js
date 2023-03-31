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
});
app.listen(5000, () => {
    console.log("Running on port 5000.");
});

console.log("hello world");

const serviceAccount = require("./drawer-webapp-firebase-adminsdk-hkovu-65c07adb80");

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
                let parameter = {
                    transaction_details: {
                        order_id: doc.id,
                        gross_amount: parseInt(doc.data().price),
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
