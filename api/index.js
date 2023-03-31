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

const serviceAccount = require({
    type: "service_account",
    project_id: "drawer-webapp",
    private_key_id: "65c07adb80f59acd705c66a46fdf77d0c03264ff",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8IQHhMLOH+FBq\nzS024w/SYw7yhFcj2u15iXU7nbUsZGn9xlwFB8c1c52hzvCyrThrSXgUytrYbQD1\ns5DW484S+UG305j2JOPYMU71pmji+6gBL6DNkLOHctzGYFyBQVke28bIhfoNSZXW\ned71/10nJo2fELZrAQyf2G2nWpHhR2KuKUEWXVwukqzXAfWmCqWhU5hJtU7a8svQ\nK3DoA59RmrfFIqHJAqu4/SPt4E5K6RlXUwhhgTXJwL7epRyiEg7HMwC5RHkF0HAd\nAC/oYn6Lm8xlmAnHviPkb4k7rqNsqTfjtPd4yj274mZltCRKsgEiFre0rIeEFbM6\nFsJI59H9AgMBAAECggEAGWtATMP+zfVgMD4OyOa/IYce4ue8umx/P7ex7l8ttpTO\nuWpOzqMxaGh5uP40CYBcKirgHbcXAL0hrxEXFeHr2yZwmbzuYvuzCWgIKirU6y5j\nkd10lbHif/+mEuu8M/63YvMBFeD8W0VBCJyo4oYheQO9iOuCKk0W/pYIot8a7Nwz\n/CqMajQ92tmnNGLsIoR5VFta6fgk/KfZ2O/umyvWJP0TSCN+zAvXl/ruq/Bj3QRn\nk5JiMxRwJ8rxzQKy60eJT4Q4kLNIJfEKuavQDUCN6nEtugrrX7AWhKVd68dA7L0r\nVBAbW28eYVtg98I/ZKgU/rKmCImo4ykWKYfAUf9QgQKBgQDlyOa0DlpeRAcev8KP\nPbaWM4eCCS5EQvSsVROi+R3D14XU+MTtxBgzv2eJtuBokdyVXhFriqpbMxao0Z3P\nL3o75Ms0ELO/NcSMIcYNdcek5BOEN4e2+b0JpQ0hKvp/tWb00CdyBup8oBoVWG14\nJavCG4MuRw0jNsR5eFxWyucsXQKBgQDRl4FE77VHjEEUqq+kskNaxhkf9N4mLgqY\n/yHg3cyUpuLVo1Ho4V3jf0dpCtKv/vIwp7OkI93X5KlJ1JTR8ZyE4hJ0QNcCzfWc\nQ23kUVcyCHcw7gJKOs8cXaC4ddsA4RbWQGitcOCZHKghUS4QwUU5BMtP+myc+KPX\neRu1BKXiIQKBgQCZw4FV9dDVCbK2Cd4Y2lQnWJ4SDzCtrxxpgZjdUtRvK/a7mCi3\nbqQ/ZJLVXdH3R7wTG9qOW0E6PAqqt3JhpUSndafg1Fhj2IgIucT9VtZc6d6BeGNR\ntvaf0Jnjmw37jZkys2Ph8uzQrpYluIGwh4zTHHQA8LzC1rBNFJS945MkZQKBgD25\nBFSs0xHy9+eCLJ+v76330MZccl+EB5Lu76ctKmZMj1ii9ChE1kV84ibJDSrPRbuW\nZ4zbEyXVLRWVCQ6avKFVgmHCBo/I35/ZK6+lVKxjWdaLARmjIAMWf5JTAt/LadJG\nvYz2RO5SRiEpqws8H4qfItC2yu2fO4DlJYe1irSBAoGBAJjp38AVOaAO/YtL7kn4\nNBfQo21zZUJWqtD3r49sDpK9AxOfklBEodXNvfyFhPDF1P6pQfn4529C8TY7W/4l\njbUBzYUlVyyTjirPQbnhmX/VMqPsRcfH3t8lZU3HYv3dE6yZ6qwxDZ0Tus+oWioi\n5VKqQt1w9pkgmBYkVLZHdvG1\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-hkovu@drawer-webapp.iam.gserviceaccount.com",
    client_id: "104624487036110398474",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hkovu%40drawer-webapp.iam.gserviceaccount.com",
});

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
