// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// The GIPHY SDK
const giphy = require('giphy-js-sdk-core');
const client = giphy(functions.config().giphy.key);

// CORS to avoid header errors
const cors = require('cors')({ origin: true });

// query GIPHY for trending or general search
exports.queryGiphy = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var query = req.query.query;
    var limit = req.query.limit;

    if (query) {
      client.search('gifs', {'q': query, 'limit': limit})
        .then((response) => {
          res.status(200).send(response.data);
        })
    } else {
      client.trending('gifs', {'limit': limit})
        .then((response) => {
          res.status(200).send(response.data);
        })
    }
  });
});