// Interface with Python scripts to return faceswapped GIF
function swapFaces() {
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
			window.open("img/" + data + ".gif", "_blank");
		}
	});
}