var file = ""             // url of uploaded file
var gif = ""              // url of selected GIF
var htmls = ["","","",""] // url of displayed GIFs

// On load, display 4 trending GIFs
$(document).ready(function() {
	getGifs("");
});

// Run search when user presses enter
$("#search-bar").keypress(function(e) {
	if(e.keyCode == 13) {
		search();
	}
});

// update GIFs per user specified search terms, default is trending
function getGifs(query) {
	$.ajax({
		type: "POST",
		url: "/searchGifs",
		contentType:"application/json; charset=utf-8",
		data: JSON.stringify({ query: query }),
		processData: false,
		success: function(data) {
			htmls = JSON.parse(data)
			for (i = 0; i < htmls.length; i++) {
				document.getElementById(
					"search-results").children[i].innerHTML =
					"<img src='" + htmls[i] + "' onclick='selectGif(this)'>";
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