// use image as button, upload through hidden file input
function uploadSelfie() {
  $('#selfie').click()
}

// upload and display image when user selects file
(function() {
  document.getElementById('selfie').onchange = function() {
    var selfie = document.getElementById('selfie').files[0];
    if (selfie) {
      var element = document.getElementById('input-img').children[0];
      element.src = 'img/spinner.gif';
      var task = firebase.storage().ref('img/' + selfie.name).put(selfie);
      task.on('state_changed', 
        function progress(snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        function error(e) {
          alert('Error: could not upload file');
          element.src = '';
        },
        function complete() {
          var imgUrl = task.snapshot.downloadURL;
          element.src = imgUrl;
        }
      )
    }
  };
})();