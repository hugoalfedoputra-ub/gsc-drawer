const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");
const admin = require("firebase-admin");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://gsc-drawer-app.vercel.app/new" || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
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

io.on("connection", (socket) => {
    console.log(`transcation connected: ${socket.id}`);
});

const db = admin.firestore();
const colRef = db.collection("user-request");

const content = [];

const getPayment = () => {
    colRef
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().status === "pending") {
                    content.push({ id: doc.id, price: doc.data().price, status: doc.data().status });
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
                            // transaction token
                            let transactionToken = transaction.token;
                            console.log("transactionToken:", transactionToken);

                            // transaction redirect url
                            let transactionRedirectUrl = transaction.redirect_url;
                            console.log("transactionRedirectUrl:", transactionRedirectUrl);
                            const updateRef = db.collection("user-request").doc(doc.id);
                            await updateRef.update({ pyLink: transactionRedirectUrl, status: "paid-pending" });
                        })
                        .catch((e) => {
                            console.log("Error occured:", e.message);
                        });
                    console.log(content);
                }
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

// getPayment();
setInterval(getPayment, 5000);

app.get("/message", (req, res) => {
    res.json({ message: "hello from server!" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

module.exports = app;
