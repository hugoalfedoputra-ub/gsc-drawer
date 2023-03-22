const midtransClient = require("midtrans-client");

export let coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.REACT_APP_MIDTRANS_SERVER_KEY,
    clientKey: process.env.REACT_APP_MIDTRANS_CLIENT_KEY,
});
