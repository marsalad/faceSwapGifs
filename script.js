var file = ""
var gif = ""
var htmls = ["","","","","",""]

$(document).ready(function(){
    $('#search-bar').keypress(function(e){
        if(e.keyCode==13) {
            search();
        }
    });
});

function search() {
	text = document.getElementById("search-bar").value;
	text = text.replace(/\s/g, "+");
	var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=" 
		+ text + "&api_key=4a018e825a5d46a295514306536ef93b&limit=6",
			function(response) {
				$(response.data).each(function(index,value) {
					document.getElementById("gif-" + (index+1)).innerHTML = "<img src='" + response.data[index].images.fixed_height.url + "'>"
					document.getElementById("gif-" + (index+1)).firstChild.style.border = "0px solid red"
					htmls[index] = (response.data[index].images.downsized_medium.url)
				})
			})
}

function selectGif(caller) {
	for (i = 0; i < 6; i++) {
		document.getElementById("gif-" + (i+1)).firstChild.style.border = "0px solid red";
	}
	caller.firstChild.style.border = "3px solid red";
	gif = htmls[caller.id.substring(4,5)-1];
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
