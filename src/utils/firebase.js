const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNTS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;