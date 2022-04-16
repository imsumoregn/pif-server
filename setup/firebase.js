const admin = require("firebase-admin");
const serviceAccount = require("../config/mentorship-v2-firebase-adminsdk-l5b6s-e0fcf094d6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "mentorship-v2.appspot.com",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };