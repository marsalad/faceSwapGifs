var file = ""
var gif = ""
var htmls = ["","","",""]

$(document).ready(function() {
	$('#search-bar').keypress(function(e) {
		if(e.keyCode == 13) {
			search();
		}
	});
	var xhr = $.get("https://api.giphy.com/v1/gifs/trending?"
		+ "api_key=4a018e825a5d46a295514306536ef93b&limit=4",
		function(response) {
			$(response.data).each(function(index,value) {
				document.getElementById("search-results").children[index].innerHTML = 
					"<img src='" + response.data[index].images.original.url 
					+ "' onclick='selectGif(this)'>"
				htmls[index] = (response.data[index].images.original.url)
			})
		})
});

function search() {
	text = document.getElementById("search-bar").value;
	text = text.replace(/\s/g, "+");
	var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=" 
		+ text + "&api_key=4a018e825a5d46a295514306536ef93b&limit=4",
		function(response) {
			$(response.data).each(function(index,value) {
				document.getElementById("search-results").children[index].innerHTML = 
					"<img src='" + response.data[index].images.original.url 
					+ "' onclick='selectGif(this)'>"
				htmls[index] = (response.data[index].images.original.url)
			})
		})
}

function selectGif(caller) {
	gif = htmls[caller.parentNode.id.substring(4,5)-1];
	document.getElementById("input-gif").children[0].src = gif;
}

function previewFile() {
	// Where you will display your image
	var preview = document.getElementById("preview");
	// The button where the user chooses the local image to display
	file = document.querySelector('input[type=file]').files[0];
	// FileReader instance
	var reader  = new FileReader();

	// When the image is loaded we will set it as source of
	// our img tag
	reader.onloadend = function () {
		preview.src = reader.result;
	}

	if (file) {
		// Load image as a base64 encoded URI
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}

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
