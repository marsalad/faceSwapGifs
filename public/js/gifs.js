// On load, display 4 trending GIFs
$(document).ready(function() {
	getGifs('');
})

// Run search when user presses enter
$('#search-bar').keypress(function(e) {
	if (e.keyCode == 13) {
		search()
	}
})

// update GIFs per user specified search terms, default is trending
function getGifs(query) {
	if(query) {
		requestSnippet = 'search?q=' + query + '&'
	} else {
		requestSnippet = 'trending?'
	}

	$.ajax({
		url: 'https://us-central1-faceswapgifs.cloudfunctions.net/queryGiphy',
		type: 'GET',
		contentType: 'application/json',
		data: {
			query: requestSnippet,
			num: 4
		},
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

// Pull top 4 GIFs based on search terms
function search() {
	getGifs(document.getElementById('search-bar').value.replace(/\s/g, '+'));
}

// User selects the GIF to faceswap
function selectGif(caller) {
	document.getElementById('input-gif').children[0].src = caller.src;
}

// Interface with Python scripts to return faceswapped GIF
function swapFaces() {
	document.getElementById("output-gif").children[0].src = 
		"https://media.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif";
	$.ajax({
		type: "POST",
		url: "/swapFaces",
		contentType:"application/json; charset=utf-8",
		data: JSON.stringify({
			gif: document.getElementById("input-gif").children[0].src, 
			img: document.getElementById("input-img").children[0].src
		}),
		processData: false,
		success: function(data) {
			document.getElementById("output-gif").children[0].src = data;
		}
	});
}