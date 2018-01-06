// use image as button, upload through hidden file input
function uploadSelfie() {
  document.getElementById('selfie').click();
}

// upload and display image when user selects file
(function() {
  document.getElementById('selfie').onchange = function() {
    var selfie = document.getElementById('selfie').files[0];
    if (selfie) {
      imgIO.empty = false;
      setImg(imgIO.element, loading);
      var task = firebase.storage().ref('img/' + selfie.name).put(selfie);
      task.on('state_changed', 
        function progress(snapshot) {
          var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + prog + '% done');
        },
        function complete() {
          setImg(imgIO.element, task.snapshot.downloadURL);
        },
        function error() {
          setImg(imgIO.element, task.snapshot.downloadURL); // actually success
          // imgIO.empty = true;
          // setImg(imgIO.element, imgIO.default);
          // alert('Error uploading image.');
        }
      )
    }
  };
})();

// create and display face-swapped GIF
function swapFaces() {
  if (getImg(gifIO.element) === gifIO.default) {
    alert('Please select a GIF.');
    return;
  } else if (getImg(imgIO.element) === imgIO.default) {
    alert('Please upload an image.');
    return;
  }

  swapIO.empty = false;
  setImg(swapIO.element, loading);

  $.ajax({
    url: 'https://us-central1-faceswapgifs.cloudfunctions.net/swapFaces',
    type: 'POST',
    contentType:'application/json; charset=utf-8',
    data: {
      gif: getImg(document.getElementById('input-gif')), 
      img: getImg(document.getElementById('input-img'))
    },
    success: function(data) {
      setImg(swapIO.element, data.img);
    },
    error: function() {
      swapIO.empty = true;
      setImg(swapIO.element, swapIO.default);
      alert('Error: could not swap faces');
    }
  });
}