const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");

console.log("hello world");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

app.get("/message", (req, res) => {
    res.json({ message: "hello from server!" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

module.exports = app;
