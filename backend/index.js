const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

console.log("hello world");

const app = express();

const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

let parameter = {
    transaction_details: {
        order_id: "YOUR-ORDERID-123456",
        gross_amount: 10000,
    },
    credit_card: {
        secure: true,
    },
    customer_details: {
        first_name: "budi",
        last_name: "pratama",
        email: "budi.pra@example.com",
        phone: "08111222333",
    },
};

snap.createTransaction(parameter).then((transaction) => {
    // transaction token
    let transactionToken = transaction.token;
    console.log("transactionToken:", transactionToken);
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/api/message", (req, res) => {
    res.json({ message: "hello from server!" });
});

app.listen(8000, () => {
    console.log("server is running on port 8000");
});

module.exports = app;