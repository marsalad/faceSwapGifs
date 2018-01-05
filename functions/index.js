// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

exports.queryGiphy = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var xhr = $.get('https://api.giphy.com/v1/gifs/' + req.query.query 
      + 'api_key=' + functions.config().giphy.key + '&limit=' + req.query.num);
    xhr.done(function(data) {
      res.status(200).send({data.data});
    });
  });
});