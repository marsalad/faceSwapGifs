// use image as button, upload through hidden file input
function upload() {
	$("#file").click()
}

// begin file upload when user selects image
(function() {
	document.getElementById("file").onchange = function(){
		var file = document.getElementById("file").files[0];
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