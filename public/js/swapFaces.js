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