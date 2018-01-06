// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

exports.queryGiphy = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if (req.query.query) {
			var snippet = 'search?q=' + req.query.query + '&';
		} else {
			var snippet = 'trending?';
		}
		var url = 'https://api.giphy.com/v1/gifs/' + snippet + 'api_key=' 
			+ functions.config().giphy.key + '&limit=' + req.query.limit;
		
		res.status(200).send({ url: url });
	});
});

// https://us-central1-faceswapgifs.cloudfunctions.net/queryGiphy ? query=trending%3F&count=4
// https://api.giphy.com/v1/gifs/trending ? api_key=htJyEZnds2pWeTHxvTcruxdxDBox356V&limit=4