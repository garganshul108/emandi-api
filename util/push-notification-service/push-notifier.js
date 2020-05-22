const admin = require("firebase-admin");
const serviceAccount = require("./e-mandi-4bcb4-firebase-adminsdk-m2mkf-d95e4e400e.json");

const sendNotification = (token, message) => {
  return new Promise((resolve, reject) => {
    admin.initializeApp({
      credential: admin.credential.sert(serviceAccount),
      databaseURL: "https://fir-storage-820df.firebase.io",
    });

    const payload = {
      data: {
        key: message,
      },
    };

    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24,
    };

    admin
      .messaging()
      .sendToDevice(token, payload, options)
      .then((response) => {
        console.log(`Successfully sent the message: ${message}`);
        resolve(response);
      })
      .catch((e) => {
        console.log(`Unsuccessful attempt to send message: ${message}`);
        reject(e);
      });
  });
};

module.exports = sendNotification;
