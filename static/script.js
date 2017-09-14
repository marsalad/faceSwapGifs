var gif = ""              // url of selected GIF
var htmls = ["","","",""] // url of displayed GIFs

// On load, display 4 trending GIFs
$(document).ready(function() {
	getGifs("");
})

// use image as button, upload through hidden file input
function upload() {
	$("#file").click()
}

// begin file upload when user selects image
(function() {
	document.getElementById("file").onchange = function(){
		var files = document.getElementById("file").files;
		var file = files[0];
		if (!file) {
			return alert("No file selected.");
		}
		getSignedRequest(file);
	};
})();

// retrieve an appropriate signed request for file upload
function getSignedRequest(file){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var response = JSON.parse(xhr.responseText);
				uploadFile(file, response.data, response.url);
			} else {
				alert("Could not get signed URL.");
			}
		}
	};
	xhr.send();
}

// upload the file to s3
function uploadFile(file, s3Data, url){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", s3Data.url);

	var postData = new FormData();
	for (key in s3Data.fields) {
		postData.append(key, s3Data.fields[key]);
	}
	postData.append('file', file);

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4){
			if (xhr.status === 200 || xhr.status === 204) {
				document.getElementById("input-img").children[0].src = url;
			} else {
				alert("Could not upload file.");
			}
		}
	};
	xhr.send(postData);
}

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