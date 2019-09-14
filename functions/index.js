const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest(async (request, response) => {
 response.send(`<?xml version="1.0" encoding="UTF-8"?>
 <Response>
     <Sms>Hello from Reach!</Sms>
 </Response>`);
});
