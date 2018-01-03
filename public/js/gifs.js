// On load, display 4 trending GIFs
$(document).ready(function() {
	getGifs("");
})

// Run search when user presses enter
$("#search-bar").keypress(function(e) {
	if (e.keyCode == 13) {
		search()
	}
})

// update GIFs per user specified search terms, default is trending
function getGifs(query) {
	$.ajax({
		type: "POST",
		url: "/searchGifs",
		contentType:"application/json; charset=utf-8",
		data: JSON.stringify({ query: query }),
		processData: false,
		success: function(data) {
			var htmls = JSON.parse(data)
			for (i = 0; i < htmls.length; i++) {
				document.getElementById(
					"search-results").children[i].children[0].src = htmls[i];
			}
		}
	});
}

// Pull top 4 GIFs based on search terms
function search() {
	text = document.getElementById("search-bar").value;
	text = text.replace(/\s/g, "+");
	getGifs(text);
}

// User selects the GIF to faceswap
function selectGif(caller) {
	document.getElementById("input-gif").children[0].src = caller.src;
}