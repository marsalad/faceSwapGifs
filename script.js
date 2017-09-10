file = ""

function search() {
	text = document.getElementById("search-bar").value;
	text = text.replace(/\s/g, "+");
	var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=" 
		+ text + "&api_key=4a018e825a5d46a295514306536ef93b&limit=6",
			function(response) {
				console.log(response)
				$(response.data).each(function(index,value) {
					document.getElementById("gif-" + (index+1)).innerHTML = "<img src='" + response.data[index].images.fixed_height.url + "'>"
					document.getElementById("gif-" + (index+1)).firstChild.style.border = "0px solid red"
				})
			})
}

function selectGif(caller) {
	for (i = 0; i < 6; i++) {
		document.getElementById("gif-" + (i+1)).firstChild.style.border = "0px solid red";
	}
	caller.firstChild.style.border = "3px solid red";
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

function faceswap() {

}