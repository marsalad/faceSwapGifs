var file = ""                            // url of uploaded file
var gif = ""                             // url of selected GIF
var htmls = ["","","",""]                // url of displayed GIFs
var giphyKey = '{{ env('GIPHY_KEY') }}'; // API Key for access to GIPHY search

// On load, display 4 trending GIFs
$(document).ready(function() {
	var xhr = $.get("https://api.giphy.com/v1/gifs/trending?"
		+ "api_key=" + giphyKey + "&limit=4",
		function(response) {
			$(response.data).each(function(index,value) {
				document.getElementById("search-results").children[index].innerHTML = 
					"<img src='" + response.data[index].images.original.url 
					+ "' onclick='selectGif(this)'>"
				htmls[index] = (response.data[index].images.original.url)
			})
		});
});

// Run search when user presses enter
$("#search-bar").keypress(function(e) {
	if(e.keyCode == 13) {
		search();
	}
});

// Pull top 4 GIFs based on search terms
function search() {
	text = document.getElementById("search-bar").value;
	text = text.replace(/\s/g, "+");
	var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" 
		+ text + "&api_key=" + giphyKey + "&limit=4",
		function(response) {
			$(response.data).each(function(index,value) {
				document.getElementById("search-results").children[index].innerHTML = 
					"<img src='" + response.data[index].images.original.url 
					+ "' onclick='selectGif(this)'>"
				htmls[index] = (response.data[index].images.original.url)
			})
		})
}

// User selects the GIF to faceswap
function selectGif(caller) {
	gif = htmls[caller.parentNode.id.substring(4,5)-1];
	document.getElementById("input-gif").children[0].src = gif;
}

// Update preview of uploaded image
function previewFile() {
	var preview = document.getElementById("preview");
	file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();
	
	reader.onloadend = function () {
		preview.src = reader.result;
	}

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}

// Interface with Python scripts to return faceswapped GIF
function swapFaces() {
	$.ajax({
		type: "POST",
		url: "/swapFaces",
		contentType:"application/json; charset=utf-8",
		data: JSON.stringify({ gif: gif, img: file.name }),
		processData: false,
		success: function(data) {
			window.open("img/" + data + ".gif", "_blank");
		}
	});
}
